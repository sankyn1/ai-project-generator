# 🚀 AI Project Generator

[![Built with Kiro IDE](https://img.shields.io/badge/Built%20with-Kiro%20IDE-6366f1.svg)](https://kiro.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%5E18.2.0-blue)](https://reactjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Transform your project requirements into comprehensive, professional deliverables using AI. Generate everything from technical specifications to database schemas, flow diagrams, and implementation guides - all from a simple requirements list.

![AI Project Generator Demo](https://via.placeholder.com/800x400/667eea/ffffff?text=AI+Project+Generator+Demo)

## ✨ Features

### 🎯 **Multi-Provider AI Support**
- **OpenAI** (GPT-4, GPT-3.5 Turbo)
- **Google AI** (Gemini Pro, Gemini 2.5 Flash) - **FREE TIER AVAILABLE**
- **Anthropic** (Claude 3 Opus, Sonnet, Haiku)
- **Groq** (Llama 2, Mixtral) - **FREE & FAST**
- **Ollama** (Local models) - **COMPLETELY FREE**
- **Cohere, Hugging Face, Together AI**

### 📋 **Comprehensive Deliverables**
- **📄 SRS Document** - Complete Software Requirements Specification
- **📊 Flow Diagrams** - Interactive Mermaid flowcharts
- **🗄️ SQL Schema** - Database design with relationships and queries
- **🎨 Figma Specifications** - UI/UX design guidelines with color palettes
- **🛠️ Tech Stack** - Technology recommendations with reasoning
- **🏗️ Project Structure** - Clean Architecture following industry best practices
- **🔗 References** - Similar projects, tools, and learning resources

### 🔧 **Flexible Input Methods**
- **✏️ Manual Entry** - Add requirements one by one
- **📁 File Upload** - Excel, Word, CSV, and text files
- **📝 Text Paste** - Copy from any source with smart parsing

### 🎨 **Beautiful Visual Output**
- **Dual View Mode** - Rendered view + raw code
- **Interactive Diagrams** - Mermaid flowcharts render visually
- **Color Visualizations** - Live color swatches in design specs
- **Syntax Highlighting** - Professional code display
- **Export Options** - PDF, JSON, SQL, Mermaid files

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- API key from any supported AI provider

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-project-generator.git
cd ai-project-generator

# Install dependencies
npm run setup

# Start the application
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

### First Time Setup

1. **Open the app** at http://localhost:3000
2. **Click "API Config"** in the top right
3. **Choose your AI provider**:
   - **Free options**: Google AI, Groq, Ollama
   - **Paid options**: OpenAI, Anthropic, Together AI
4. **Enter your API key**
5. **Start generating!**

## 🔑 Getting API Keys

### Free Options

#### Google AI (Recommended for beginners)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Free tier includes generous limits

#### Groq (Fastest free option)
1. Sign up at [Groq Console](https://console.groq.com/)
2. Generate an API key
3. Very fast inference with free tier

#### Ollama (Completely free, runs locally)
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama2
```

### Paid Options

#### OpenAI (Highest quality)
1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Create an API key
3. Add billing information

#### Anthropic (Claude)
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Generate an API key
3. Claude 3 models available

## 📖 Usage Guide

### Basic Workflow

1. **Add Requirements**
   - Use manual entry, file upload, or text paste
   - Be specific about features and functionality
   - Include user stories and acceptance criteria

2. **Configure Settings**
   - Select project type (Web App, Mobile, API, etc.)
   - Set technology preferences (optional)
   - Choose your AI provider and model

3. **Generate Deliverables**
   - Click "Generate Project Deliverables"
   - Wait for AI to create comprehensive documentation
   - Review results in beautiful rendered format

4. **Export and Use**
   - Switch between "Rendered" and "Code" views
   - Export as PDF, JSON, SQL, or Mermaid files
   - Copy code directly for implementation

### Example Requirements

```
User authentication with email and password
Dashboard with analytics charts
File upload and management system
Real-time notifications
Mobile responsive design
Payment integration with Stripe
Admin panel for user management
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18, Monaco Editor, Lucide Icons
- **Backend**: Node.js, Express, Axios
- **AI Integration**: Multi-provider support
- **Visualization**: Mermaid diagrams, syntax highlighting
- **Export**: PDF generation, file downloads

### Project Structure
```
ai-project-generator/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main application
│   │   └── App.css        # Styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   │   ├── generators.js  # AI content generation
│   │   ├── aiProviders.js # Multi-provider AI client
│   │   └── logger.js      # Logging system
│   ├── logs/              # Generated logs
│   └── index.js           # Server entry point
├── docs/                  # Documentation
└── README.md
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Fork and clone the repo
git clone https://github.com/yourusername/ai-project-generator.git

# Install dependencies
npm run setup

# Start development servers
npm run dev

# Run tests (when available)
npm test
```

### Ways to Contribute

- 🐛 **Bug Reports** - Found an issue? Let us know!
- 💡 **Feature Requests** - Have ideas for improvements?
- 🔧 **Code Contributions** - Submit pull requests
- 📚 **Documentation** - Help improve our docs
- 🎨 **Design** - UI/UX improvements
- 🌍 **Translations** - Help make it accessible globally

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤖 Built with Kiro IDE

This entire project was created using **[Kiro IDE](https://kiro.ai)** - an AI-powered development environment that accelerates software development through intelligent code generation, automated testing, and seamless collaboration between developers and AI.

### Why Kiro IDE?

- **🚀 Rapid Development** - Built this comprehensive project in record time
- **🧠 AI-Powered** - Intelligent code suggestions and generation
- **🔧 Full-Stack Support** - Seamless frontend and backend development
- **📝 Documentation** - Auto-generated docs and README files
- **🎨 UI/UX Design** - AI-assisted component and styling creation
- **🔍 Code Quality** - Built-in linting, formatting, and best practices

> *"This project showcases the power of AI-assisted development. What traditionally would take weeks to build was accomplished in days using Kiro IDE's intelligent development environment."*

**Try Kiro IDE**: [kiro.ai](https://kiro.ai) | **Learn More**: [Documentation](https://docs.kiro.ai)

---

## 🙏 Acknowledgments

- **🤖 Kiro IDE** - The AI development environment that made this project possible
- **OpenAI** for GPT models and AI infrastructure
- **Google** for Gemini AI and free tier access
- **Anthropic** for Claude models
- **Mermaid** for beautiful diagram rendering
- **Monaco Editor** for professional code editing
- **React** and **Node.js** communities for amazing frameworks

## ☕ Support the Project

If this project helped you save time and create amazing deliverables, consider supporting its development!

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support%20development-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/shivshankarnamdev)

Your support helps:
- 🚀 **Maintain and improve** the project
- 🆕 **Add new AI providers** and features  
- 📚 **Create better documentation** and tutorials
- 🐛 **Fix bugs** and improve performance
- 🌟 **Keep the project free** and open source

**Other ways to support:**
- ⭐ **Star this repository** on GitHub
- 🐛 **Report bugs** and suggest features
- 🤝 **Contribute code** or documentation
- 📢 **Share the project** with others

## 📞 Support & Community

- 📖 **Documentation**: Check our [Wiki](https://github.com/yourusername/ai-project-generator/wiki)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/ai-project-generator/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-project-generator/discussions)
- ☕ **Donate**: [Buy Me a Coffee](https://buymeacoffee.com/shivshankarnamdev)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/ai-project-generator&type=Date)](https://star-history.com/#yourusername/ai-project-generator&Date)

---

**Made with ❤️ by the open source community**

*Transform your ideas into reality with AI-powered project generation!*