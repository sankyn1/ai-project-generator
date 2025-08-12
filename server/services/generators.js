const aiProvider = require('./aiProviders');
const logger = require('./logger');

// Generate Software Requirements Specification
async function generateSRS(requirements, projectType, apiConfig) {
  try {
    const prompt = `
Generate a comprehensive Software Requirements Specification (SRS) document based on these requirements:

Requirements: ${JSON.stringify(requirements, null, 2)}
Project Type: ${projectType}

Include the following sections:
1. Introduction and Purpose
2. Overall Description
3. Functional Requirements (detailed)
4. Non-Functional Requirements
5. System Features
6. User Interface Requirements
7. Performance Requirements
8. Security Requirements
9. Assumptions and Dependencies

Format as structured markdown with clear sections and subsections.
`;

    console.log('🔄 Generating SRS...');
    const response = await aiProvider.generateText(prompt, apiConfig);
    
    // Log the prompt and response
    await logger.logPromptAndResponse('SRS', prompt, response, {
      provider: apiConfig.provider,
      model: apiConfig.model,
      projectType,
      requirementsCount: requirements.length
    });

    return response;
  } catch (error) {
    console.error('SRS Generation Error:', error);
    await logger.logError('SRS', error, { requirements, projectType, apiConfig });
    throw new Error(`Failed to generate SRS: ${error.message}`);
  }
}

// Generate Flow Diagram (Mermaid format)
async function generateFlowDiagram(requirements, projectType, apiConfig) {
  try {
    const prompt = `
Create a system flow diagram in VALID Mermaid syntax. Follow these EXACT rules:

Requirements: ${JSON.stringify(requirements, null, 2)}
Project Type: ${projectType}

CRITICAL RULES - DO NOT DEVIATE:
1. Start with EXACTLY: flowchart TD
2. Use ONLY single letters for nodes: A, B, C, D, E, F, G, H
3. Use ONLY this arrow syntax: A --> B
4. Put ALL labels in square brackets with quotes: A["Label Text"]
5. For decisions use curly braces: C{"Question?"}
6. For conditions use: C -->|Yes| D

VALID EXAMPLE:
\`\`\`mermaid
flowchart TD
    A["Start"] --> B["Process"]
    B --> C{"Decision?"}
    C -->|Yes| D["Action 1"]
    C -->|No| E["Action 2"]
    D --> F["End"]
    E --> F
\`\`\`

INVALID EXAMPLES (DO NOT USE):
- graph TD (use flowchart TD)
- Define Node Styles (no style definitions)
- A - --> B (use A --> B)
- Spaces in node names
- Complex formatting

Generate a simple, clean flowchart showing the main user flow for this ${projectType}.
Use maximum 8 nodes (A through H). Keep it simple and syntactically correct.
`;

    console.log('🔄 Generating Flow Diagram...');
    const response = await aiProvider.generateText(prompt, apiConfig);
    
    // Log the prompt and response
    await logger.logPromptAndResponse('FLOW_DIAGRAM', prompt, response, {
      provider: apiConfig.provider,
      model: apiConfig.model,
      projectType,
      requirementsCount: requirements.length
    });

    return response;
  } catch (error) {
    console.error('Flow Diagram Generation Error:', error);
    await logger.logError('FLOW_DIAGRAM', error, { requirements, projectType, apiConfig });
    throw new Error(`Failed to generate flow diagram: ${error.message}`);
  }
}

// Generate SQL Schema and Templates
async function generateSQLSchema(requirements, projectType, apiConfig) {
  const prompt = `
Generate comprehensive SQL database schema and templates based on these requirements:

Requirements: ${JSON.stringify(requirements, null, 2)}
Project Type: ${projectType}

Provide:
1. Complete CREATE TABLE statements
2. Proper relationships and foreign keys
3. Indexes for performance
4. Sample INSERT statements
5. Common query templates
6. Database migration scripts

Use PostgreSQL syntax with best practices.
`;

  return await aiProvider.generateText(prompt, apiConfig);
}

// Generate Figma Design Specifications
async function generateFigmaDesign(requirements, projectType, apiConfig) {
  const prompt = `
Generate detailed Figma design specifications and wireframes based on these requirements:

Requirements: ${JSON.stringify(requirements, null, 2)}
Project Type: ${projectType}

Provide:
1. Detailed wireframe descriptions for each screen
2. Component specifications
3. Color palette recommendations
4. Typography guidelines
5. Layout structure
6. Interactive elements
7. Responsive design considerations
8. User flow between screens

Format as detailed design specifications that can be implemented in Figma.
`;

  return await aiProvider.generateText(prompt, apiConfig);
}

// Generate Technology Stack Recommendations
async function generateTechStack(requirements, techPreferences, projectType, apiConfig) {
  const prompt = `
Recommend optimal technology stack based on these requirements:

Requirements: ${JSON.stringify(requirements, null, 2)}
Tech Preferences: ${JSON.stringify(techPreferences, null, 2)}
Project Type: ${projectType}

Provide detailed recommendations for:
1. Frontend technologies
2. Backend technologies
3. Database solutions
4. Cloud services
5. Development tools
6. Testing frameworks
7. Deployment strategies
8. Third-party integrations

Include reasoning for each recommendation and alternatives.
`;

  return await aiProvider.generateText(prompt, apiConfig);
}

// Generate Project Structure following best practices
async function generateProjectStructure(requirements, projectType, techPreferences, apiConfig) {
  try {
    console.log('🏗️ Starting project structure generation...');
    const prompt = `
Generate a comprehensive project structure following industry best practices and clean architecture principles for:

Requirements: ${JSON.stringify(requirements, null, 2)}
Project Type: ${projectType}
Tech Preferences: ${JSON.stringify(techPreferences, null, 2)}

Create a detailed folder structure that follows:
1. Clean Architecture principles (Domain, Application, Infrastructure layers)
2. SOLID principles
3. Separation of concerns
4. Industry best practices from top tech companies (Google, Microsoft, Netflix, etc.)
5. Scalable and maintainable structure
6. Testing structure (unit, integration, e2e)
7. Configuration management
8. Documentation structure
9. CI/CD pipeline structure
10. Environment-specific configurations

Include:
- Complete folder tree with explanations
- Key files and their purposes
- Architecture layers explanation
- Best practices reasoning
- Scalability considerations
- Team collaboration structure

Format as a detailed markdown document with folder tree visualization.
`;

    const result = await aiProvider.generateText(prompt, apiConfig);
    console.log('✅ Project structure generated, length:', result?.length || 0);
    
    // Log the prompt and response
    await logger.logPromptAndResponse('PROJECT_STRUCTURE', prompt, result, {
      provider: apiConfig.provider,
      model: apiConfig.model,
      projectType,
      requirementsCount: requirements.length
    });
    
    return result;
  } catch (error) {
    console.error('❌ Project Structure Generation Error:', error);
    throw new Error(`Failed to generate project structure: ${error.message}`);
  }
}

// Generate References and Similar Projects
async function generateReferences(requirements, projectType, techPreferences, apiConfig) {
  try {
    console.log('🔗 Starting references generation...');
    const prompt = `
Generate comprehensive references and similar projects for:

Requirements: ${JSON.stringify(requirements, null, 2)}
Project Type: ${projectType}
Tech Preferences: ${JSON.stringify(techPreferences, null, 2)}

Provide detailed references including:

1. **Open Source Projects** (GitHub repositories with similar functionality):
   - Repository URLs
   - Star count and activity level
   - Architecture patterns used
   - Key features and learnings
   - Code quality and documentation

2. **Live Websites/Applications** (production examples):
   - Website URLs
   - Company/organization behind it
   - Key features and UX patterns
   - Technology stack used
   - Scale and performance insights

3. **Architecture References**:
   - System design patterns
   - Microservices examples
   - Database design patterns
   - API design examples
   - Security implementation examples

4. **Learning Resources**:
   - Documentation and tutorials
   - Best practice guides
   - Architecture blogs and articles
   - Video tutorials and courses
   - Books and whitepapers

5. **Tools and Libraries**:
   - Recommended libraries and frameworks
   - Development tools
   - Testing frameworks
   - Deployment tools
   - Monitoring and analytics tools

6. **Industry Examples**:
   - How top companies solve similar problems
   - Case studies and success stories
   - Performance benchmarks
   - Scalability examples

Format as organized markdown with clear sections, clickable links, and detailed descriptions.
`;

    const result = await aiProvider.generateText(prompt, apiConfig);
    console.log('✅ References generated, length:', result?.length || 0);
    return result;
  } catch (error) {
    console.error('❌ References Generation Error:', error);
    throw new Error(`Failed to generate references: ${error.message}`);
  }
}

module.exports = {
  generateSRS,
  generateFlowDiagram,
  generateSQLSchema,
  generateFigmaDesign,
  generateTechStack,
  generateProjectStructure,
  generateReferences
};