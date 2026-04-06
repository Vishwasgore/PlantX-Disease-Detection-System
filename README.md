# 🌿 PlantX - Plant Disease Detection System

An AI-powered web application that detects plant diseases from leaf images and provides actionable agricultural advice. Upload a photo of a plant leaf and get an instant diagnosis with treatment recommendations.

**Live Demo:** [PlantX on Vercel](https://your-app.vercel.app) &nbsp;|&nbsp; **Backend API:** [Hugging Face Spaces](https://hbssqwskqjw-plantx-disease-detection-system.hf.space)

---

## What It Does

1. User uploads a photo of a plant leaf on the website
2. The image is sent to the backend AI model
3. A CNN model classifies the disease (or confirms the plant is healthy)
4. A language model (TinyLlama) generates farming advice based on the diagnosis
5. Results are shown on screen: disease name, confidence score, top 3 predictions, and treatment advice

---

## Project Structure

```
agriculture_disease/
├── Backend/                    # Python FastAPI backend + ML models
│   ├── app.py                  # FastAPI server entry point
│   ├── models/
│   │   ├── best_model.h5       # Trained CNN model (MobileNetV2)
│   │   ├── class_indices.json  # Disease class mappings
│   │   └── training_history.png
│   ├── src/
│   │   ├── train_cnn.py        # Model training script
│   │   ├── inference_pipeline.py  # Prediction logic
│   │   ├── utils.py            # Image preprocessing utilities
│   │   ├── blip_fallback.py    # BLIP visual analysis (fallback)
│   │   ├── llm_advisor_hf.py   # TinyLlama via Hugging Face API
│   │   └── llm_advisor.py      # TinyLlama via local Ollama
│   ├── dataset/                # Training images (15 disease classes)
│   ├── requirements.txt
│   └── Dockerfile
└── PlantX-React/               # React frontend
    ├── src/
    │   ├── App.jsx             # Main app logic + API calls
    │   └── components/
    │       ├── UploadSection.jsx
    │       ├── ResultsSection.jsx
    │       ├── LoadingSection.jsx
    │       ├── Hero.jsx
    │       ├── HowItWorks.jsx
    │       ├── Header.jsx
    │       └── Footer.jsx
    ├── vercel.json
    └── package.json
```

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Python | Core language |
| FastAPI | REST API server |
| TensorFlow / Keras | CNN model training and inference |
| MobileNetV2 | Pre-trained base model (Transfer Learning) |
| BLIP (Salesforce) | Visual image captioning (fallback) |
| TinyLlama 1.1B | AI-generated farming advice |
| Pillow / OpenCV | Image loading and preprocessing |
| NumPy | Array and numerical operations |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Lucide React | Icons |

### Deployment
| Service | What runs there |
|---|---|
| Hugging Face Spaces | Python backend + CNN model |
| Vercel | React frontend |

---

## Diseases Detected

The model classifies plant leaf images into **15 categories** across 3 plant types:

| Plant | Disease / Condition |
|---|---|
| Tomato | Healthy |
| Tomato | Early Blight |
| Tomato | Late Blight |
| Tomato | Bacterial Spot |
| Tomato | Leaf Mold |
| Tomato | Septoria Leaf Spot |
| Tomato | Spider Mites (Two-spotted) |
| Tomato | Target Spot |
| Tomato | Yellow Leaf Curl Virus |
| Tomato | Mosaic Virus |
| Potato | Healthy |
| Potato | Early Blight |
| Potato | Late Blight |
| Bell Pepper | Healthy |
| Bell Pepper | Bacterial Spot |

---

## How the Model Works

### Transfer Learning with MobileNetV2

Instead of training from scratch, the project uses **MobileNetV2** — a model pre-trained on ImageNet (millions of general images). Custom classification layers are added on top and trained specifically for plant diseases.

**Model Architecture:**
```
MobileNetV2 (frozen, pre-trained on ImageNet)
    ↓
GlobalAveragePooling2D
    ↓
Dense(512, activation='relu')
    ↓
Dropout(0.5)
    ↓
Dense(15, activation='softmax')  ← 15 disease classes
```

### Two-Phase Training

**Phase 1** — Only the new top layers are trained (MobileNetV2 is frozen).  
**Phase 2** — The entire model is unfrozen and fine-tuned with a very low learning rate (`1e-5`).

### Data Augmentation

To prevent overfitting, training images are randomly:
- Rotated up to 40°
- Flipped horizontally
- Zoomed in/out
- Shifted horizontally and vertically

### Confidence-Based Routing

After the CNN predicts a class, the system checks reliability:
- If confidence **≥ 70%** AND gap between top-1 and top-2 prediction **≥ 20%** → CNN result is used
- If confidence is **below threshold** → BLIP visual analysis is used as fallback

---

## API Endpoints

Base URL: `https://hbssqwskqjw-plantx-disease-detection-system.hf.space`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API info and available endpoints |
| GET | `/health` | Health check |
| POST | `/predict` | Upload image and get disease prediction |

### Example Request

```bash
curl -X POST "https://hbssqwskqjw-plantx-disease-detection-system.hf.space/predict" \
  -F "image=@your_leaf_image.jpg"
```

### Example Response

```json
{
  "success": true,
  "diagnosis": "Tomato - Late Blight",
  "confidence": 0.87,
  "source": "CNN Classification",
  "timestamp": "2026-04-06 10:30:00",
  "cnn_predictions": {
    "top_3_predictions": [
      { "disease": "Tomato - Late Blight", "confidence": 0.87 },
      { "disease": "Tomato - Early Blight", "confidence": 0.08 },
      { "disease": "Tomato - Healthy", "confidence": 0.03 }
    ]
  },
  "advice": {
    "full_advice": "Disease Detected: Tomato - Late Blight...",
    "summary": "Immediate treatment recommended..."
  }
}
```

---

## Local Setup

### Backend

```bash
cd Backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Add environment variables
cp .env.example .env
# Edit .env and add your HF_TOKEN if needed

# Run the server
uvicorn app:app --reload --port 8000
```

API will be available at `http://localhost:8000`  
Interactive docs at `http://localhost:8000/docs`

### Frontend

```bash
cd PlantX-React

# Install dependencies
npm install

# Set environment variable
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

Frontend will be available at `http://localhost:5173`

### Test a Prediction (CLI)

```bash
cd Backend
python src/inference_pipeline.py test_images/sample4.jpg
```

---

## Training the Model

If you want to retrain the model on your own dataset:

```bash
cd Backend

# Dataset should be organized as:
# dataset/
#   ClassName1/image1.jpg
#   ClassName2/image1.jpg
#   ...

python src/train_cnn.py
```

Trained model will be saved to `Backend/models/best_model.h5`

---

## Deployment

### Deploy Backend to Hugging Face Spaces

1. Create a new Space on [huggingface.co](https://huggingface.co) (Docker SDK)
2. Push the `Backend/` folder contents to the Space repo
3. The `Dockerfile` handles the build automatically

### Deploy Frontend to Vercel

1. Push `PlantX-React/` to a GitHub repository
2. Import the repo on [vercel.com](https://vercel.com)
3. Add environment variable in Vercel dashboard:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://hbssqwskqjw-plantx-disease-detection-system.hf.space`
4. Deploy

---

## Environment Variables

### Backend (`Backend/.env`)
```env
TINYLLAMA_MODEL_ID=hbssqwskqjw/VishwasTinyllama
HF_TOKEN=your_huggingface_token_here
```

### Frontend (`PlantX-React/.env`)
```env
VITE_API_URL=https://hbssqwskqjw-plantx-disease-detection-system.hf.space
```

---

## Screenshots

> Upload a plant leaf image → Get instant disease diagnosis → Read AI-generated treatment advice

---

## License

MIT License — free to use and modify.
