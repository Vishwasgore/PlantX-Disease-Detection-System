# PlantX - React + Tailwind CSS

Modern React frontend with Tailwind CSS for Plant Disease Detection.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd PlantX-React
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173

### 3. Build for Production

```bash
npm run build
```

## 🌐 Deploy to Vercel

### Option 1: Using Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: Using Vercel Dashboard

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

### Environment Variables

The backend API URL is already configured:
- **VITE_API_URL**: `https://hbssqwskqjw-plantx-disease-detection-system.hf.space`

No additional configuration needed!

## ✨ Features

- React 18 with Vite
- Tailwind CSS for styling
- Lucide React icons
- Fully responsive design
- Drag & drop image upload
- Real-time loading states
- Beautiful results display
- AI advice from Groq API

## 📦 Project Structure

```
PlantX-React/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── UploadSection.jsx
│   │   ├── LoadingSection.jsx
│   │   ├── ResultsSection.jsx
│   │   ├── HowItWorks.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🎨 Customization

### Change API URL

Edit `.env`:
```
VITE_API_URL=your-backend-url
```

### Modify Colors

Edit `tailwind.config.js`:
```js
colors: {
  primary: {
    500: '#10b981', // Change this
    // ...
  }
}
```

## 🐛 Troubleshooting

### CORS Error

Make sure your backend allows requests from your frontend domain. Update backend CORS settings.

### API Not Responding

1. Check backend is running: `curl https://hbssqwskqjw-plantx-disease-detection-system.hf.space/health`
2. Verify API URL in `.env`
3. Check browser console for errors

## 📝 License

MIT
