const fs = require('fs').promises;
const path = require('path');

class Logger {
  constructor() {
    this.logsDir = path.join(__dirname, '../logs');
    this.ensureLogsDirectory();
  }

  async ensureLogsDirectory() {
    try {
      await fs.mkdir(this.logsDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create logs directory:', error);
    }
  }

  async logPromptAndResponse(type, prompt, response, metadata = {}) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${type}_${timestamp}.txt`;
      const filepath = path.join(this.logsDir, filename);

      const logContent = `
=== AI PROJECT GENERATOR LOG ===
Type: ${type}
Timestamp: ${new Date().toISOString()}
Provider: ${metadata.provider || 'unknown'}
Model: ${metadata.model || 'unknown'}
Requirements Count: ${metadata.requirementsCount || 0}
Project Type: ${metadata.projectType || 'unknown'}

=== PROMPT ===
${prompt}

=== RESPONSE ===
${response}

=== METADATA ===
${JSON.stringify(metadata, null, 2)}

=== END LOG ===
`;

      await fs.writeFile(filepath, logContent, 'utf8');
      console.log(`📝 Logged ${type} to: ${filename}`);
      
      return filename;
    } catch (error) {
      console.error(`Failed to log ${type}:`, error);
    }
  }

  async logError(type, error, context = {}) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `ERROR_${type}_${timestamp}.txt`;
      const filepath = path.join(this.logsDir, filename);

      const logContent = `
=== ERROR LOG ===
Type: ${type}
Timestamp: ${new Date().toISOString()}
Error Message: ${error.message}
Stack Trace: ${error.stack}

=== CONTEXT ===
${JSON.stringify(context, null, 2)}

=== END ERROR LOG ===
`;

      await fs.writeFile(filepath, logContent, 'utf8');
      console.log(`❌ Error logged to: ${filename}`);
      
      return filename;
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  async logAllPrompts(prompts, metadata = {}) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `ALL_PROMPTS_${timestamp}.txt`;
      const filepath = path.join(this.logsDir, filename);

      let logContent = `
=== ALL PROMPTS LOG ===
Timestamp: ${new Date().toISOString()}
Provider: ${metadata.provider || 'unknown'}
Model: ${metadata.model || 'unknown'}
Project Type: ${metadata.projectType || 'unknown'}

`;

      Object.entries(prompts).forEach(([type, prompt]) => {
        logContent += `
=== ${type.toUpperCase()} PROMPT ===
${prompt}

`;
      });

      logContent += `
=== METADATA ===
${JSON.stringify(metadata, null, 2)}

=== END ALL PROMPTS LOG ===
`;

      await fs.writeFile(filepath, logContent, 'utf8');
      console.log(`📝 All prompts logged to: ${filename}`);
      
      return filename;
    } catch (error) {
      console.error('Failed to log all prompts:', error);
    }
  }
}

module.exports = new Logger();