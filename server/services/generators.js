const aiProvider = require('./aiProviders');
const logger = require('./logger');

// Generate Software Requirements Specification
async function generateSRS(requirements, projectType, apiConfig) {
  try {
    // Optimize requirements to reduce token usage while keeping detail
    const detailedRequirements = requirements.map((req, index) => `${index + 1}. ${req}`).join('\n');
    
    const prompt = `
Create SRS document for ${projectType}:

Requirements:
${detailedRequirements}

Include:
1. Introduction & Purpose
2. Overall Description
3. Functional Requirements (detailed)
4. Non-Functional Requirements (performance, security, usability)
5. System Features
6. User Interface Requirements
7. Assumptions & Dependencies

Format as structured markdown with clear sections.
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
    // Optimize requirements to key features only
    const keyFeatures = requirements.slice(0, 3).map(req => req.substring(0, 80)).join('; ');
    
    const prompt = `
Create Mermaid flowchart for ${projectType} with features: ${keyFeatures}

RULES:
1. Start with: flowchart TD
2. Use single letters: A, B, C, D, E, F
3. Labels in quotes: A["Start"]
4. Decisions: C{"Question?"}
5. Arrows: A --> B
6. Conditions: C -->|Yes| D

Example:
\`\`\`mermaid
flowchart TD
    A["Start"] --> B["Login"]
    B --> C{"Valid?"}
    C -->|Yes| D["Dashboard"]
    C -->|No| B
    D --> E["End"]
\`\`\`

Generate simple user flow (max 6 nodes). Keep syntax correct.
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
  try {
    // Optimize requirements to reduce token usage
    const keyRequirements = requirements.slice(0, 4).map(req => req.substring(0, 100)).join('; ');
    
    const prompt = `
Create SQL schema for ${projectType} with features: ${keyRequirements}

Generate:
1. CREATE TABLE statements (main entities)
2. Primary/foreign keys and relationships
3. Essential indexes
4. Sample INSERT data
5. Common queries

Use PostgreSQL syntax. Keep it practical and focused.
`;

    console.log('🗄️ Generating SQL Schema...');
    const result = await aiProvider.generateText(prompt, apiConfig);
    
    // Log the prompt and response
    await logger.logPromptAndResponse('SQL_SCHEMA', prompt, result, {
      provider: apiConfig.provider,
      model: apiConfig.model,
      projectType,
      requirementsCount: requirements.length
    });
    
    return result;
  } catch (error) {
    console.error('❌ SQL Schema Generation Error:', error);
    throw new Error(`Failed to generate SQL schema: ${error.message}`);
  }
}

// Generate Figma Design Specifications
async function generateFigmaDesign(requirements, projectType, apiConfig) {
  try {
    // Optimize requirements to reduce token usage
    const optimizedRequirements = requirements.slice(0, 5).map(req => req.substring(0, 100)).join('; ');
    
    const prompt = `
Create Figma design specs for a ${projectType} with these key features: ${optimizedRequirements}

Include:
1. Main screen wireframes (3-5 screens max)
2. Color palette (5-6 colors)
3. Typography (2-3 font sizes)
4. Key components (buttons, forms, cards)
5. Layout structure
6. User flow

Keep it concise but implementable.
`;

    console.log('🎨 Generating Figma Design...');
    const result = await aiProvider.generateText(prompt, apiConfig);
    
    // Log the prompt and response
    await logger.logPromptAndResponse('FIGMA_DESIGN', prompt, result, {
      provider: apiConfig.provider,
      model: apiConfig.model,
      projectType,
      requirementsCount: requirements.length
    });
    
    return result;
  } catch (error) {
    console.error('❌ Figma Design Generation Error:', error);
    throw new Error(`Failed to generate Figma design: ${error.message}`);
  }
}

// Generate Technology Stack Recommendations
async function generateTechStack(requirements, techPreferences, projectType, apiConfig) {
  try {
    // Optimize inputs to reduce token usage
    const keyRequirements = requirements.slice(0, 3).map(req => req.substring(0, 80)).join('; ');
    const prefs = Object.entries(techPreferences).filter(([k, v]) => v).map(([k, v]) => `${k}: ${v}`).join(', ');
    
    const prompt = `
Recommend tech stack for ${projectType} with features: ${keyRequirements}
Preferences: ${prefs}

Provide:
1. Frontend: Framework + key libraries
2. Backend: Language/framework + database
3. Cloud: Platform + key services
4. DevOps: CI/CD + deployment
5. Testing: Frameworks + tools

Include brief reasoning for each choice.
`;

    console.log('⚙️ Generating Tech Stack...');
    const result = await aiProvider.generateText(prompt, apiConfig);
    
    // Log the prompt and response
    await logger.logPromptAndResponse('TECH_STACK', prompt, result, {
      provider: apiConfig.provider,
      model: apiConfig.model,
      projectType,
      requirementsCount: requirements.length
    });
    
    return result;
  } catch (error) {
    console.error('❌ Tech Stack Generation Error:', error);
    throw new Error(`Failed to generate tech stack: ${error.message}`);
  }
}

// Generate Project Structure following best practices
async function generateProjectStructure(requirements, projectType, techPreferences, apiConfig) {
  try {
    console.log('🏗️ Starting project structure generation...');
    
    // Optimize inputs to reduce token usage
    const keyRequirements = requirements.slice(0, 3).map(req => req.substring(0, 80)).join('; ');
    const mainTech = techPreferences.frontend || techPreferences.backend || 'modern web stack';
    
    const prompt = `
Create clean architecture project structure for ${projectType} using ${mainTech}.
Key features: ${keyRequirements}

Generate:
1. Folder tree (src/, tests/, docs/, config/)
2. Clean architecture layers (domain, application, infrastructure)
3. Key files and purposes
4. Testing structure
5. Configuration setup

Focus on scalability and maintainability. Use industry best practices.
Format as markdown with folder tree.
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
    
    // Optimize inputs to reduce token usage
    const keyFeatures = requirements.slice(0, 3).map(req => req.substring(0, 60)).join(', ');
    const mainTech = techPreferences.frontend || techPreferences.backend || 'web technologies';
    
    const prompt = `
Find references for ${projectType} with features: ${keyFeatures}
Tech stack: ${mainTech}

Provide:
1. **GitHub Repos** (3-4 similar projects):
   - Repo name and URL
   - Key features
   - Architecture used

2. **Live Examples** (2-3 production apps):
   - Website URL
   - Company/creator
   - Notable features

3. **Learning Resources**:
   - Documentation links
   - Tutorials and guides
   - Best practice articles

4. **Tools & Libraries**:
   - Recommended frameworks
   - Development tools
   - Testing libraries

Keep it practical and actionable.
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