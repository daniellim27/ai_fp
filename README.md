# XSS Vulnerability Scanner

A web application for detecting XSS vulnerabilities in JavaScript and PHP code using fine-tuned CodeBERT models.

## Features

- **AI-Powered Detection**: Uses CodeBERT models fine-tuned on 10,000+ XSS patterns
- **Multi-Language Support**: JavaScript and PHP vulnerability scanning
- **GitHub Integration**: Scan repositories directly from GitHub
- **Multi-Vulnerability Detection**: Finds multiple vulnerabilities per file with line numbers

## Project Structure

```
├── frontend/          # React/Vite frontend
├── training_notebook.ipynb  # Model training code
└── README.md
```

## Quick Start

### Frontend (Local Development)
```bash
cd frontend
npm install
npm run dev
```

### Backend (Required for scanning)
The backend is deployed on Hugging Face Spaces. For local development:
```bash
# Clone the backend repo or run locally
# See backend deployment instructions
```

## Models

- **PHP XSS Model**: 92% accuracy, trained on 9,700 balanced samples
- **JS XSS Model**: Trained on 14,000+ real-world XSS patterns

## Deployment

- **Frontend**: Vercel
- **Backend**: Hugging Face Spaces (Docker)

## License

MIT License
