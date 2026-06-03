from sqlalchemy import Column, Integer, String, Float, DateTime, Text, BigInteger
from database import Base

class Athlete(Base):
    __tablename__ = "athletes"

    id               = Column(Integer, primary_key=True, index=True)
    strava_id        = Column(BigInteger, unique=True, index=True)
    firstname        = Column(String, default="")
    lastname         = Column(String, default="")
    profile_picture  = Column(String, default="")
    city             = Column(String, default="")
    country          = Column(String, default="")
    access_token     = Column(String)
    refresh_token    = Column(String)
    token_expires_at = Column(Integer, default=0)

class Activity(Base):
    __tablename__ = "activities"

    id                = Column(Integer, primary_key=True, index=True)
    strava_id         = Column(BigInteger, unique=True, index=True)
    athlete_id        = Column(Integer, index=True)
    name              = Column(String, default="")
    sport_type        = Column(String, default="Run")
    distance          = Column(Float, default=0)       # meters
    moving_time       = Column(Integer, default=0)     # seconds
    elapsed_time      = Column(Integer, default=0)     # seconds
    total_elevation   = Column(Float, default=0)       # meters
    average_speed     = Column(Float, default=0)       # m/s
    max_speed         = Column(Float, default=0)
    average_heartrate = Column(Float, nullable=True)
    max_heartrate     = Column(Float, nullable=True)
    start_date        = Column(DateTime, nullable=True)
    map_polyline      = Column(Text, default="")
    kudos_count       = Column(Integer, default=0)
    suffer_score      = Column(Float, nullable=True)
