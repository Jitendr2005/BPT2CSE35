from __future__ import annotations

from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

FEATURE_ORDER = ["studyHours", "attendance", "assignments", "previousMarks", "marks"]
TARGET_COLUMN = "finalScore"


def train_model(dataset_path: str, model_path: str, force_retrain: bool = False):
    dataset_file = Path(dataset_path)
    model_file = Path(model_path)

    if model_file.exists() and not force_retrain:
        return joblib.load(model_file)

    dataframe = pd.read_csv(dataset_file)
    features = dataframe[FEATURE_ORDER]
    target = dataframe[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        features, target, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)
    score = model.score(X_test, y_test)

    artifacts = {
        "model": model,
        "feature_order": FEATURE_ORDER,
        "r2_score": round(float(score), 4),
    }
    model_file.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(artifacts, model_file)

    return artifacts


if __name__ == "__main__":
    base_dir = Path(__file__).resolve().parents[1]
    result = train_model(
        dataset_path=str(base_dir.parent / "database" / "student_performance_dataset.csv"),
        model_path=str(base_dir / "models" / "student_performance_model.joblib"),
        force_retrain=True,
    )
    print(
        f"Training complete. Model saved with R2 score: {result['r2_score']}"
    )
