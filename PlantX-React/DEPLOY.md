# Deploy PlantX React Frontend to Vercel

## Prerequisites

- Node.js installed
- Vercel account (free): https://vercel.com

## Method 1: Quick Deploy with Vercel CLI (Recommended)

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Navigate to Project

```bash
cd PlantX-React
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Test Locally (Optional)

```bash
npm run dev
```

Visit http://localhost:5173 to test

### 5. Deploy

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- Project name? **plantx-disease-detection** (or your choice)
- Directory? **./** (press Enter)
- Override settings? **No**

### 6. Deploy to Production

```bash
vercel --prod
```

Your app is now live! 🎉

## Method 2: Deploy via GitHub + Vercel Dashboard

### 1. Push to GitHub

```bash
cd PlantX-React
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/plantx-frontend.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click "Deploy"

### 3. Environment Variables (Already Configured)

The API URL is already set in `vercel.json`, but you can also add it in Vercel dashboard:

- Go to Project Settings → Environment Variables
- Add:
  - **Name**: `VITE_API_URL`
  - **Value**: `https://hbssqwskqjw-plantx-disease-detection-system.hf.space`

## Update Backend CORS

After deployment, update your backend to allow requests from your Vercel domain:

1. Go to your backend repo: `PlantX-Disease-Detection-System`
2. Edit `app.py`
3. Update CORS:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-app.vercel.app",  # Add your Vercel URL
        "*",  # Or keep this for all origins
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

4. Commit and push to Hugging Face

## Test Your Deployment

1. Visit your Vercel URL
2. Upload a plant image
3. Wait for analysis
4. Check results and AI advice

## Troubleshooting

### CORS Error

- Update backend CORS settings to include your Vercel domain
- Wait for backend to rebuild on Hugging Face

### API Connection Failed

- Check backend is running: `curl https://hbssqwskqjw-plantx-disease-detection-system.hf.space/health`
- Verify API URL in Vercel environment variables
- Check browser console for errors

### Build Failed

- Run `npm run build` locally to test
- Check Vercel build logs
- Verify all dependencies in `package.json`

## Custom Domain (Optional)

1. Go to Vercel Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update backend CORS with new domain

## Continuous Deployment

With GitHub integration:
- Every push to `main` triggers automatic deployment
- Pull requests get preview deployments
- Rollback to previous deployments anytime

## Your URLs

After deployment:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://hbssqwskqjw-plantx-disease-detection-system.hf.space`

## Done! 🎉

Your PlantX frontend is now live and connected to your Groq-powered backend!
