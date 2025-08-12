const express = require('express');
const router = express.Router();
const PDFLib = require('pdf-lib');
const fs = require('fs').promises;

// Export as PDF
router.post('/pdf', async (req, res) => {
  try {
    const { srs, flowDiagram, sqlSchema, figmaDesign, techStack } = req.body;

    const pdfDoc = await PDFLib.PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Letter size

    const { width, height } = page.getSize();
    const fontSize = 12;

    // Add content to PDF
    let yPosition = height - 50;

    // Title
    page.drawText('AI Generated Project Documentation', {
      x: 50,
      y: yPosition,
      size: 18,
    });

    yPosition -= 40;

    // Add sections
    const sections = [
      { title: 'Software Requirements Specification', content: srs },
      { title: 'Flow Diagram', content: flowDiagram },
      { title: 'SQL Schema', content: sqlSchema },
      { title: 'Figma Design Specifications', content: figmaDesign },
      { title: 'Technology Stack', content: techStack }
    ];

    for (const section of sections) {
      if (yPosition < 100) {
        const newPage = pdfDoc.addPage([612, 792]);
        yPosition = height - 50;
      }

      page.drawText(section.title, {
        x: 50,
        y: yPosition,
        size: 14,
      });

      yPosition -= 30;

      // Add content (truncated for PDF)
      const truncatedContent = section.content.substring(0, 500) + '...';
      page.drawText(truncatedContent, {
        x: 50,
        y: yPosition,
        size: fontSize,
        maxWidth: width - 100,
      });

      yPosition -= 100;
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=project-documentation.pdf');
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error('PDF export failed:', error);
    res.status(500).json({ error: 'PDF export failed' });
  }
});

// Export as JSON
router.post('/json', (req, res) => {
  try {
    const data = req.body;
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=project-data.json');
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: 'JSON export failed' });
  }
});

// Export Mermaid diagram
router.post('/mermaid', (req, res) => {
  try {
    const { flowDiagram } = req.body;
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=flow-diagram.mmd');
    res.send(flowDiagram);

  } catch (error) {
    res.status(500).json({ error: 'Mermaid export failed' });
  }
});

// Export SQL files
router.post('/sql', (req, res) => {
  try {
    const { sqlSchema } = req.body;
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=database-schema.sql');
    res.send(sqlSchema);

  } catch (error) {
    res.status(500).json({ error: 'SQL export failed' });
  }
});

module.exports = router;