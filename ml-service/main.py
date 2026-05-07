import os
from pathlib import Path

import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel

from scripts.train_model import train_model

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "student_performance_model.joblib"
DATASET_PATH = BASE_DIR.parent / "database" / "student_performance_dataset.csv"


class PredictionPayload(BaseModel):
    studyHours: float
    attendance: float
    assignments: float
    previousMarks: float
    marks: float


app = FastAPI(title="Student Performance ML Service", version="1.0.0")
artifacts = None


def get_category(score: float) -> str:
    if score >= 75:
        return "Good"
    if score >= 50:
        return "Average"
    return "Weak"


def ensure_model_loaded():
    global artifacts
    if artifacts is None:
        artifacts = train_model(
            dataset_path=os.getenv("DATASET_PATH", str(DATASET_PATH)),
            model_path=os.getenv("MODEL_PATH", str(MODEL_PATH)),
        )
    return artifacts


@app.on_event("startup")
def startup_event():
    ensure_model_loaded()


@app.get("/health")
def health():
    return {"status": "ok", "service": "ml-service"}


@app.post("/train")
def retrain():
    global artifacts
    artifacts = train_model(
        dataset_path=os.getenv("DATASET_PATH", str(DATASET_PATH)),
        model_path=os.getenv("MODEL_PATH", str(MODEL_PATH)),
        force_retrain=True,
    )
    return {"message": "Model trained successfully"}


@app.post("/predict")
def predict(payload: PredictionPayload):
    loaded = ensure_model_loaded()
    model = loaded["model"]
    feature_order = loaded["feature_order"]
    input_row = pd.DataFrame(
        [{field: getattr(payload, field) for field in feature_order}],
        columns=feature_order,
    )
    predicted_score = float(model.predict(input_row)[0])
    predicted_score = max(0.0, min(100.0, round(predicted_score, 2)))

    return {
        "predicted_score": predicted_score,
        "performance_category": get_category(predicted_score),
    }
