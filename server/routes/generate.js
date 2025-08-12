const express = require('express');
const router = express.Router();
const { 
  generateSRS, 
  generateFlowDiagram, 
  generateSQLSchema, 
  generateFigmaDesign,
  generateTechStack,
  generateProjectStructure,
  generateReferences
} = require('../services/generators');

// Main generation endpoint
router.post('/', async (req, res) => {
  try {
    const { requirements, techPreferences, projectType, apiConfig } = req.body;

    if (!requirements || requirements.length === 0) {
      return res.status(400).json({ error: 'Requirements are required' });
    }

    if (!apiConfig) {
      return res.status(400).json({ error: 'API configuration is required' });
    }

    console.log(`🔄 Starting generation process with ${apiConfig.provider}...`);

    // Generate all deliverables in parallel for efficiency
    console.log('📋 Generating SRS, Flow, SQL, Figma, Tech Stack...');
    const [srs, flowDiagram, sqlSchema, figmaDesign, techStack] = await Promise.all([
      generateSRS(requirements, projectType, apiConfig),
      generateFlowDiagram(requirements, projectType, apiConfig),
      generateSQLSchema(requirements, projectType, apiConfig),
      generateFigmaDesign(requirements, projectType, apiConfig),
      generateTechStack(requirements, techPreferences, projectType, apiConfig)
    ]);

    console.log('🏗️ Generating Project Structure and References...');
    let projectStructure = '';
    let references = '';
    
    try {
      // Generate them separately to better handle individual failures
      try {
        console.log('📁 Generating Project Structure...');
        projectStructure = await generateProjectStructure(requirements, projectType, techPreferences, apiConfig);
        console.log('✅ Project Structure completed:', projectStructure?.length || 0, 'characters');
      } catch (structureError) {
        console.error('❌ Project Structure failed:', structureError.message);
        projectStructure = `# Project Structure\n\n⚠️ Generation failed: ${structureError.message}\n\nPlease check the logs for details.`;
      }

      try {
        console.log('🔗 Generating References...');
        references = await generateReferences(requirements, projectType, techPreferences, apiConfig);
        console.log('✅ References completed:', references?.length || 0, 'characters');
      } catch (referencesError) {
        console.error('❌ References failed:', referencesError.message);
        references = `# References\n\n⚠️ Generation failed: ${referencesError.message}\n\nPlease check the logs for details.`;
      }
    } catch (error) {
      console.error('❌ Unexpected error in additional content generation:', error);
      projectStructure = `# Project Structure\n\nUnexpected error occurred.`;
      references = `# References\n\nUnexpected error occurred.`;
    }

    console.log('✅ All content generated successfully');
    console.log('📊 Content lengths:', {
      srs: srs?.length || 0,
      flowDiagram: flowDiagram?.length || 0,
      sqlSchema: sqlSchema?.length || 0,
      figmaDesign: figmaDesign?.length || 0,
      techStack: techStack?.length || 0,
      projectStructure: projectStructure?.length || 0,
      references: references?.length || 0
    });

    const result = {
      srs,
      flowDiagram,
      sqlSchema,
      figmaDesign,
      techStack,
      projectStructure,
      references,
      metadata: {
        generatedAt: new Date().toISOString(),
        requirementsCount: requirements.length,
        projectType,
        provider: apiConfig.provider,
        model: apiConfig.model
      }
    };

    console.log('✅ Generation completed successfully');
    res.json(result);

  } catch (error) {
    console.error('❌ Generation failed:', error);
    res.status(500).json({ 
      error: 'Generation failed', 
      details: error.message 
    });
  }
});

// Individual generation endpoints
router.post('/srs', async (req, res) => {
  try {
    const { requirements, projectType, apiConfig } = req.body;
    const srs = await generateSRS(requirements, projectType, apiConfig);
    res.json({ srs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/flow-diagram', async (req, res) => {
  try {
    const { requirements, projectType, apiConfig } = req.body;
    const flowDiagram = await generateFlowDiagram(requirements, projectType, apiConfig);
    res.json({ flowDiagram });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/sql-schema', async (req, res) => {
  try {
    const { requirements, projectType, apiConfig } = req.body;
    const sqlSchema = await generateSQLSchema(requirements, projectType, apiConfig);
    res.json({ sqlSchema });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/figma-design', async (req, res) => {
  try {
    const { requirements, projectType, apiConfig } = req.body;
    const figmaDesign = await generateFigmaDesign(requirements, projectType, apiConfig);
    res.json({ figmaDesign });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;