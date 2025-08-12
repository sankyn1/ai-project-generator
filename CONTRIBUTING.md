# Contributing to AI Project Generator

Thank you for your interest in contributing to AI Project Generator! We welcome contributions from everyone.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/ai-project-generator.git
   cd ai-project-generator
   ```

3. **Install dependencies**
   ```bash
   npm run setup
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

5. **Create a branch for your feature**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🤝 How to Contribute

### 🐛 Bug Reports

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, etc.)

### 💡 Feature Requests

For new features:
- Check existing issues first
- Describe the feature and its benefits
- Provide use cases
- Consider implementation complexity

### 🔧 Code Contributions

1. **Pick an issue** or create one for discussion
2. **Follow coding standards**:
   - Use ESLint and Prettier configurations
   - Write clear, descriptive commit messages
   - Add comments for complex logic
   - Follow existing code patterns

3. **Test your changes**:
   - Ensure the app runs without errors
   - Test with different AI providers
   - Verify all features work as expected

4. **Submit a Pull Request**:
   - Reference the related issue
   - Describe what you changed and why
   - Include screenshots for UI changes
   - Ensure CI passes

## 📝 Coding Standards

### JavaScript/React
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Keep components small and focused
- Use proper error handling

### File Structure
```
client/src/
├── components/          # Reusable React components
├── services/           # API calls and utilities
├── App.js             # Main application
└── App.css            # Global styles

server/
├── routes/            # Express routes
├── services/          # Business logic
├── logs/              # Generated logs
└── index.js           # Server entry point
```

### Commit Messages
Use conventional commits:
```
feat: add new AI provider support
fix: resolve mermaid diagram rendering issue
docs: update API documentation
style: improve button styling
refactor: simplify file upload logic
test: add unit tests for generators
```

## 🎯 Areas for Contribution

### High Priority
- 🧪 **Testing** - Unit tests, integration tests
- 📚 **Documentation** - API docs, tutorials, examples
- 🌍 **Internationalization** - Multi-language support
- 🎨 **UI/UX** - Design improvements, accessibility
- 🔧 **Performance** - Optimization, caching

### Medium Priority
- 🤖 **New AI Providers** - Add support for more AI services
- 📊 **Export Formats** - Additional export options
- 🔌 **Integrations** - GitHub, Jira, Slack integrations
- 📱 **Mobile** - Responsive design improvements

### Ideas Welcome
- 🎯 **Templates** - Pre-built project templates
- 🔄 **Workflows** - Custom generation workflows
- 📈 **Analytics** - Usage tracking and insights
- 🎨 **Themes** - Dark mode, custom themes

## 🛠️ Development Guidelines

### Adding New AI Providers

1. **Update `aiProviders.js`**:
   ```javascript
   async callNewProvider(prompt, model, apiKey, baseUrl) {
     // Implementation
   }
   ```

2. **Add to providers list in `ApiKeyManager.js`**:
   ```javascript
   newprovider: {
     name: 'New Provider',
     models: [...],
     keyPlaceholder: 'key-format',
     baseUrl: 'https://api.newprovider.com'
   }
   ```

3. **Test thoroughly** with different prompts and models

### Adding New Components

1. **Create component file** in `client/src/components/`
2. **Follow naming convention**: `ComponentName.js`
3. **Add proper PropTypes** or TypeScript types
4. **Include CSS** in `App.css` with component-specific classes
5. **Export and use** in parent components

### Adding New Features

1. **Plan the feature** - Create an issue for discussion
2. **Design the API** - Plan backend endpoints if needed
3. **Implement incrementally** - Small, focused commits
4. **Test thoroughly** - Manual and automated testing
5. **Document** - Update README and add comments

## 🧪 Testing

### Manual Testing Checklist
- [ ] App starts without errors
- [ ] API configuration works for multiple providers
- [ ] Requirements input (manual, file, paste) works
- [ ] All generation types produce output
- [ ] Export functionality works
- [ ] UI is responsive on different screen sizes
- [ ] Error handling works gracefully

### Automated Testing (Future)
We're planning to add:
- Unit tests for utility functions
- Integration tests for API endpoints
- E2E tests for user workflows
- Performance tests for generation speed

## 📋 Pull Request Process

1. **Ensure your PR**:
   - [ ] Addresses a specific issue
   - [ ] Includes clear description
   - [ ] Has been tested manually
   - [ ] Follows coding standards
   - [ ] Updates documentation if needed

2. **PR Review Process**:
   - Maintainers will review within 48 hours
   - Address feedback promptly
   - Keep discussions constructive
   - Be patient with the review process

3. **After Approval**:
   - PR will be merged by maintainers
   - Your contribution will be credited
   - Consider helping with related issues

## 🏆 Recognition

Contributors will be:
- Listed in the README
- Credited in release notes
- Invited to join the maintainers team (for significant contributions)
- Given priority support for their own issues

## 📞 Getting Help

- 💬 **GitHub Discussions** - General questions and ideas
- 🐛 **GitHub Issues** - Bug reports and feature requests
- 📧 **Email** - Direct contact for sensitive issues

## 🎉 Thank You!

Every contribution, no matter how small, makes this project better. Thank you for being part of the AI Project Generator community!

---

*Happy coding! 🚀*