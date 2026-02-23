from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from src.inference_pipeline import PlantDiseaseInferencePipeline
import shutil
import os

app = FastAPI(title="Plant Disease Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = PlantDiseaseInferencePipeline(
    use_blip=True,
    use_llm=True
)

@app.get("/")
async def root():
    return {
        "message": "Plant Disease Detection API",
        "status": "running",
        "endpoints": {
            "/predict": "POST - Upload image for disease detection",
            "/health": "GET - Check API health"
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    temp_path = f"temp_{image.filename}"

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        result = pipeline.predict(temp_path)

        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        return result
        
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return {
            "success": False,
            "error": str(e)
        }
