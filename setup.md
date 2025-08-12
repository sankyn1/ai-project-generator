# AI Project Generator Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- API key from any supported AI provider (see supported providers below)

## Installation Steps

### 1. Install Dependencies

```bash
# Automated installation (recommended)
npm run setup

# OR manual installation
npm install
cd client && npm install && cd ..
```

### 2. Environment Configuration

```bash
# Copy environment template (optional - API keys configured in UI)
copy .env.example .env
```

**Note**: API keys are now configured through the web interface for better security and flexibility. No need to add them to environment files.

### 3. Start Development Server

```bash
# Start both frontend and backend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Usage

1. **Configure API**: Click "API Config" to set up your AI provider and API key
2. **Add Requirements**: List all features and functionalities you need
3. **Select Project Type**: Choose from web app, mobile app, etc.
4. **Set Tech Preferences**: Optionally specify preferred technologies
5. **Generate**: Click to create comprehensive deliverables
6. **Export**: Download results as PDF, JSON, SQL, or Mermaid files

## Supported AI Providers

### Free Options
- **Google AI (Gemini)**: Free tier available with generous limits
- **Groq**: Fast inference with free tier
- **Hugging Face**: Free inference API
- **Ollama**: Run models locally (completely free)
- **Cohere**: Free tier available

### Paid Options
- **OpenAI**: GPT-4, GPT-3.5 Turbo
- **Anthropic**: Claude 3 (Opus, Sonnet, Haiku)
- **Together AI**: Various open-source models
- **Google AI**: Gemini Ultra (paid tier)

### Local Options
- **Ollama**: Run Llama 2, Code Llama, Mistral, and other models locally

## Generated Deliverables

- **SRS Document**: Complete Software Requirements Specification
- **Flow Diagrams**: System architecture and user flow diagrams
- **SQL Schema**: Database design with tables, relationships, and queries
- **Figma Specifications**: Detailed UI/UX design guidelines
- **Tech Stack**: Recommended technologies with implementation guidance

## API Endpoints

- `POST /api/generate` - Generate all deliverables
- `POST /api/generate/srs` - Generate SRS only
- `POST /api/generate/flow-diagram` - Generate flow diagram only
- `POST /api/generate/sql-schema` - Generate SQL schema only
- `POST /api/generate/figma-design` - Generate Figma specs only
- `POST /api/export/pdf` - Export as PDF
- `POST /api/export/json` - Export as JSON
- `POST /api/export/mermaid` - Export Mermaid diagram
- `POST /api/export/sql` - Export SQL files

## Customization

### Adding New Project Types

Edit `client/src/components/RequirementsInput.js` and add new options to the project type select.

### Modifying AI Prompts

Update prompts in `server/services/generators.js` to customize the AI generation logic.

### Adding Export Formats

Extend `server/routes/export.js` to support additional export formats.

## Troubleshooting

### Common Issues

1. **API Key Error**: Ensure your API key is valid and has sufficient credits/quota
2. **Port Conflicts**: Change PORT in .env if 5000 is already in use
3. **Generation Timeout**: Large requirements may take longer; consider breaking them down
4. **Provider Not Responding**: Check if the AI service is available and your API key is correct
5. **Ollama Connection**: Ensure Ollama is running locally on port 11434 for local models

### Provider-Specific Setup

#### Ollama (Local)
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama2
ollama pull codellama
```

#### Google AI
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Use the key in the API Config

#### Groq
1. Sign up at [Groq Console](https://console.groq.com/)
2. Generate an API key
3. Use the key in the API Config

### Performance Tips

- Keep requirements concise but detailed
- Use specific project types for better results
- Provide technology preferences for more targeted recommendations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details