from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from src.inference_pipeline import PlantDiseaseInferencePipeline
import shutil
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = PlantDiseaseInferencePipeline(
    use_blip=True,
    use_llm=True
)

@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    temp_path = f"temp_{image.filename}"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    result = pipeline.predict(temp_path)

    os.remove(temp_path)
    return result
