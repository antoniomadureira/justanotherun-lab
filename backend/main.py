from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import httpx, os, jwt, time
from datetime import datetime, timedelta
from dotenv import load_dotenv
from database import get_db, engine
import models, schemas

load_dotenv()
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="justanotherun-lab API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STRAVA_CLIENT_ID     = os.getenv("STRAVA_CLIENT_ID")
STRAVA_CLIENT_SECRET = os.getenv("STRAVA_CLIENT_SECRET")
STRAVA_REDIRECT_URI  = os.getenv("STRAVA_REDIRECT_URI", "http://localhost:8000/auth/strava/callback")
JWT_SECRET           = os.getenv("JWT_SECRET", "change-me-in-production")
FRONTEND_URL         = os.getenv("FRONTEND_URL", "http://localhost:5173")


# ── Auth helpers ─────────────────────────────────────────────────────────────

def create_jwt(athlete_id: int) -> str:
    payload = {"sub": str(athlete_id), "exp": datetime.utcnow() + timedelta(days=30)}
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def get_current_athlete(token: str = Query(..., alias="token"), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        athlete = db.query(models.Athlete).filter_by(id=int(payload["sub"])).first()
        if not athlete:
            raise HTTPException(status_code=401, detail="Athlete not found")
        return athlete
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

async def refresh_strava_token(athlete: models.Athlete, db: Session):
    """Refresh Strava token if expired."""
    if athlete.token_expires_at > int(time.time()):
        return athlete
    async with httpx.AsyncClient() as client:
        r = await client.post("https://www.strava.com/oauth/token", data={
            "client_id": STRAVA_CLIENT_ID,
            "client_secret": STRAVA_CLIENT_SECRET,
            "grant_type": "refresh_token",
            "refresh_token": athlete.refresh_token,
        })
        data = r.json()
    athlete.access_token    = data["access_token"]
    athlete.refresh_token   = data["refresh_token"]
    athlete.token_expires_at = data["expires_at"]
    db.commit()
    db.refresh(athlete)
    return athlete


# ── OAuth routes ──────────────────────────────────────────────────────────────

@app.get("/auth/strava")
def strava_login():
    url = (
        f"https://www.strava.com/oauth/authorize"
        f"?client_id={STRAVA_CLIENT_ID}"
        f"&redirect_uri={STRAVA_REDIRECT_URI}"
        f"&response_type=code"
        f"&scope=read,activity:read_all"
    )
    return RedirectResponse(url)

@app.get("/auth/strava/callback")
async def strava_callback(code: str, db: Session = Depends(get_db)):
    async with httpx.AsyncClient() as client:
        r = await client.post("https://www.strava.com/oauth/token", data={
            "client_id": STRAVA_CLIENT_ID,
            "client_secret": STRAVA_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
        })
    data = r.json()
    if "athlete" not in data:
        raise HTTPException(status_code=400, detail="Strava auth failed")

    a = data["athlete"]
    athlete = db.query(models.Athlete).filter_by(strava_id=a["id"]).first()
    if not athlete:
        athlete = models.Athlete(strava_id=a["id"])
        db.add(athlete)

    athlete.firstname       = a.get("firstname", "")
    athlete.lastname        = a.get("lastname", "")
    athlete.profile_picture = a.get("profile_medium") or a.get("profile", "")
    athlete.city            = a.get("city", "")
    athlete.country         = a.get("country", "")
    athlete.access_token    = data["access_token"]
    athlete.refresh_token   = data["refresh_token"]
    athlete.token_expires_at = data["expires_at"]
    db.commit()
    db.refresh(athlete)

    token = create_jwt(athlete.id)
    return RedirectResponse(f"{FRONTEND_URL}/callback?token={token}")


# ── Athlete ───────────────────────────────────────────────────────────────────

@app.get("/me", response_model=schemas.AthleteOut)
async def get_me(athlete: models.Athlete = Depends(get_current_athlete)):
    return athlete


# ── Sync ─────────────────────────────────────────────────────────────────────

@app.post("/sync")
async def sync_activities(
    athlete: models.Athlete = Depends(get_current_athlete),
    db: Session = Depends(get_db),
):
    athlete = await refresh_strava_token(athlete, db)
    headers = {"Authorization": f"Bearer {athlete.access_token}"}
    page, per_page, total_new = 1, 100, 0

    async with httpx.AsyncClient() as client:
        while True:
            r = await client.get(
                "https://www.strava.com/api/v3/athlete/activities",
                headers=headers,
                params={"per_page": per_page, "page": page},
            )
            activities = r.json()
            if not activities:
                break

            for a in activities:
                existing = db.query(models.Activity).filter_by(strava_id=a["id"]).first()
                if existing:
                    continue
                act = models.Activity(
                    strava_id         = a["id"],
                    athlete_id        = athlete.id,
                    name              = a.get("name", ""),
                    sport_type        = a.get("sport_type", a.get("type", "")),
                    distance          = a.get("distance", 0),
                    moving_time       = a.get("moving_time", 0),
                    elapsed_time      = a.get("elapsed_time", 0),
                    total_elevation   = a.get("total_elevation_gain", 0),
                    average_speed     = a.get("average_speed", 0),
                    max_speed         = a.get("max_speed", 0),
                    average_heartrate = a.get("average_heartrate"),
                    max_heartrate     = a.get("max_heartrate"),
                    start_date        = datetime.fromisoformat(a["start_date"].replace("Z", "+00:00")),
                    map_polyline      = a.get("map", {}).get("summary_polyline", ""),
                    kudos_count       = a.get("kudos_count", 0),
                    suffer_score      = a.get("suffer_score"),
                )
                db.add(act)
                total_new += 1

            db.commit()
            if len(activities) < per_page:
                break
            page += 1

    return {"synced": total_new}


# ── Activities ────────────────────────────────────────────────────────────────

@app.get("/activities", response_model=list[schemas.ActivityOut])
def list_activities(
    sport_type: str = None,
    limit: int = Query(20, le=100),
    offset: int = 0,
    athlete: models.Athlete = Depends(get_current_athlete),
    db: Session = Depends(get_db),
):
    q = db.query(models.Activity).filter_by(athlete_id=athlete.id)
    if sport_type:
        q = q.filter(models.Activity.sport_type == sport_type)
    return q.order_by(models.Activity.start_date.desc()).offset(offset).limit(limit).all()

@app.get("/activities/{activity_id}", response_model=schemas.ActivityOut)
def get_activity(
    activity_id: int,
    athlete: models.Athlete = Depends(get_current_athlete),
    db: Session = Depends(get_db),
):
    act = db.query(models.Activity).filter_by(id=activity_id, athlete_id=athlete.id).first()
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found")
    return act


# ── Stats ─────────────────────────────────────────────────────────────────────

@app.get("/stats")
def get_stats(
    year: int = None,
    athlete: models.Athlete = Depends(get_current_athlete),
    db: Session = Depends(get_db),
):
    from sqlalchemy import func, extract

    q = db.query(models.Activity).filter_by(athlete_id=athlete.id)
    if year:
        q = q.filter(extract("year", models.Activity.start_date) == year)

    runs = q.filter(models.Activity.sport_type.in_(["Run", "TrailRun", "VirtualRun"]))
    all_acts = q

    def agg(query):
        return query.with_entities(
            func.count().label("count"),
            func.sum(models.Activity.distance).label("total_distance"),
            func.sum(models.Activity.moving_time).label("total_time"),
            func.sum(models.Activity.total_elevation).label("total_elevation"),
        ).first()

    r = agg(runs)
    t = agg(all_acts)

    # Monthly breakdown for chart (runs only)
    monthly = runs.with_entities(
        extract("month", models.Activity.start_date).label("month"),
        func.sum(models.Activity.distance).label("distance"),
        func.count().label("count"),
    ).group_by("month").order_by("month").all()

    return {
        "runs": {
            "count":           r.count or 0,
            "total_distance":  round((r.total_distance or 0) / 1000, 2),
            "total_time":      r.total_time or 0,
            "total_elevation": round(r.total_elevation or 0, 0),
        },
        "all": {
            "count":           t.count or 0,
            "total_distance":  round((t.total_distance or 0) / 1000, 2),
        },
        "monthly": [
            {"month": int(m.month), "distance_km": round((m.distance or 0) / 1000, 2), "count": m.count}
            for m in monthly
        ],
    }
