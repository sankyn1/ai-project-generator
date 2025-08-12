const axios = require('axios');

class AIProviderService {
  constructor() {
    this.providers = {
      openai: this.callOpenAI.bind(this),
      anthropic: this.callAnthropic.bind(this),
      google: this.callGoogle.bind(this),
      cohere: this.callCohere.bind(this),
      huggingface: this.callHuggingFace.bind(this),
      ollama: this.callOllama.bind(this),
      groq: this.callGroq.bind(this),
      together: this.callTogether.bind(this)
    };
  }

  async generateText(prompt, apiConfig) {
    const { provider, model, apiKey, baseUrl } = apiConfig;
    
    console.log(`🤖 Calling ${provider} with model ${model}`);
    
    if (!this.providers[provider]) {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    if (!apiKey && provider !== 'ollama') {
      throw new Error(`API key is required for ${provider}`);
    }

    return await this.providers[provider](prompt, model, apiKey, baseUrl);
  }

  async callOpenAI(prompt, model, apiKey, baseUrl) {
    const response = await axios.post(
      `${baseUrl || 'https://api.openai.com/v1'}/chat/completions`,
      {
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 3000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  async callAnthropic(prompt, model, apiKey, baseUrl) {
    const response = await axios.post(
      `${baseUrl || 'https://api.anthropic.com'}/v1/messages`,
      {
        model,
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        }
      }
    );

    return response.data.content[0].text;
  }

  async callGoogle(prompt, model, apiKey, baseUrl) {
    try {
      // Ensure we're using the correct model name
      const modelName = model.includes('gemini') ? model : 'gemini-1.5-flash';
      const url = `${baseUrl || 'https://generativelanguage.googleapis.com/v1beta'}/models/${modelName}:generateContent?key=${apiKey}`;
      
      console.log(`🔍 Google AI Request URL: ${url}`);
      console.log(`🔍 Using model: ${modelName}`);
      
      const requestBody = {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 3000,
        }
      };
      
      console.log('🔍 Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      });

      console.log('✅ Google AI Response status:', response.status);
      console.log('✅ Google AI Response data:', JSON.stringify(response.data, null, 2));
      
      if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
        const text = response.data.candidates[0].content.parts[0].text;
        console.log('✅ Extracted text length:', text.length);
        return text;
      } else {
        console.error('❌ Invalid response structure:', JSON.stringify(response.data, null, 2));
        throw new Error('Invalid response format from Google AI - no candidates found');
      }
    } catch (error) {
      console.error('❌ Google AI API Error Details:');
      console.error('URL:', error.config?.url);
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Headers:', error.response?.headers);
      console.error('Data:', JSON.stringify(error.response?.data, null, 2));
      console.error('Message:', error.message);
      
      if (error.response?.status === 404) {
        throw new Error(`Google AI API 404: Model '${model}' not found. Available models: gemini-1.5-flash, gemini-1.5-pro`);
      } else if (error.response?.status === 403) {
        throw new Error('Google AI API 403: Invalid API key or API not enabled. Check your Google AI Studio settings.');
      } else if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.error?.message || 'Bad request';
        throw new Error(`Google AI API 400: ${errorMsg}`);
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Google AI API timeout - request took too long');
      }
      
      throw new Error(`Google AI API failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async callCohere(prompt, model, apiKey, baseUrl) {
    const response = await axios.post(
      `${baseUrl || 'https://api.cohere.ai/v1'}/generate`,
      {
        model,
        prompt,
        max_tokens: 3000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.generations[0].text;
  }

  async callHuggingFace(prompt, model, apiKey, baseUrl) {
    const response = await axios.post(
      `${baseUrl || 'https://api-inference.huggingface.co'}/models/${model}`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 3000,
          temperature: 0.7
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return Array.isArray(response.data) ? response.data[0].generated_text : response.data.generated_text;
  }

  async callOllama(prompt, model, apiKey, baseUrl) {
    const response = await axios.post(
      `${baseUrl || 'http://localhost:11434'}/api/generate`,
      {
        model,
        prompt,
        stream: false
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.response;
  }

  async callGroq(prompt, model, apiKey, baseUrl) {
    const response = await axios.post(
      `${baseUrl || 'https://api.groq.com/openai/v1'}/chat/completions`,
      {
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 3000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  async callTogether(prompt, model, apiKey, baseUrl) {
    const response = await axios.post(
      `${baseUrl || 'https://api.together.xyz'}/inference`,
      {
        model,
        prompt,
        max_tokens: 3000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.output.choices[0].text;
  }
}

module.exports = new AIProviderService();