from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AthleteOut(BaseModel):
    id: int
    strava_id: int
    firstname: str
    lastname: str
    profile_picture: str
    city: str
    country: str

    class Config:
        from_attributes = True

class ActivityOut(BaseModel):
    id: int
    strava_id: int
    name: str
    sport_type: str
    distance: float
    moving_time: int
    elapsed_time: int
    total_elevation: float
    average_speed: float
    max_speed: float
    average_heartrate: Optional[float]
    max_heartrate: Optional[float]
    start_date: Optional[datetime]
    kudos_count: int
    suffer_score: Optional[float]

    class Config:
        from_attributes = True
