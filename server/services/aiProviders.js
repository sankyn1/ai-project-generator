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
        max_tokens: 8000,
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
        max_tokens: 8000,
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
          maxOutputTokens: 8000, // Increased from 3000 to 8000
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

      // Enhanced response validation
      if (!response.data) {
        throw new Error('Empty response from Google AI API');
      }

      // Check for error in response
      if (response.data.error) {
        throw new Error(`Google AI API Error: ${response.data.error.message || 'Unknown error'}`);
      }

      // Check for candidates array
      if (!response.data.candidates || !Array.isArray(response.data.candidates)) {
        console.error('❌ No candidates array in response:', JSON.stringify(response.data, null, 2));
        throw new Error('Google AI API returned no candidates. This might be due to content filtering or API quota limits.');
      }

      // Check if candidates array is empty
      if (response.data.candidates.length === 0) {
        console.error('❌ Empty candidates array:', JSON.stringify(response.data, null, 2));
        throw new Error('Google AI API returned empty candidates array. Content may have been filtered.');
      }

      // Check first candidate
      const candidate = response.data.candidates[0];
      if (!candidate) {
        throw new Error('First candidate is null or undefined');
      }

      // Check for finish reason
      if (candidate.finishReason && candidate.finishReason !== 'STOP') {
        console.warn('⚠️ Generation finished with reason:', candidate.finishReason);
        if (candidate.finishReason === 'SAFETY') {
          throw new Error('Content was blocked by Google AI safety filters. Try rephrasing your requirements.');
        } else if (candidate.finishReason === 'MAX_TOKENS') {
          console.warn('⚠️ Response was truncated due to max tokens limit');
          // Don't throw error for MAX_TOKENS, just log warning and continue with partial content
        }
      }

      // Check content structure
      if (!candidate.content || !candidate.content.parts || !Array.isArray(candidate.content.parts)) {
        console.error('❌ Invalid content structure:', JSON.stringify(candidate, null, 2));
        throw new Error('Invalid content structure in Google AI response');
      }

      // Check if parts array is empty
      if (candidate.content.parts.length === 0) {
        throw new Error('Empty parts array in Google AI response');
      }

      // Extract text
      const textPart = candidate.content.parts[0];
      if (!textPart || !textPart.text) {
        console.error('❌ No text in first part:', JSON.stringify(textPart, null, 2));
        throw new Error('No text content in Google AI response');
      }

      let text = textPart.text;
      console.log('✅ Extracted text length:', text.length);

      if (text.length === 0) {
        throw new Error('Google AI returned empty text content');
      }

      // If response was truncated due to MAX_TOKENS, add a note
      if (candidate.finishReason === 'MAX_TOKENS') {
        text += '\n\n---\n**Note:** This response was truncated due to length limits. The content above is complete but may end abruptly. Consider breaking down your requirements into smaller sections for more detailed responses.';
      }

      return text;

    } catch (error) {
      console.error('❌ Google AI API Error Details:');
      console.error('URL:', error.config?.url);
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Headers:', error.response?.headers);
      console.error('Data:', JSON.stringify(error.response?.data, null, 2));
      console.error('Message:', error.message);

      // Handle specific HTTP errors
      if (error.response?.status === 404) {
        throw new Error(`Google AI API 404: Model '${model}' not found. Try using 'gemini-1.5-flash' or 'gemini-1.5-pro'`);
      } else if (error.response?.status === 403) {
        throw new Error('Google AI API 403: Invalid API key or API not enabled. Check your Google AI Studio settings and ensure the Gemini API is enabled.');
      } else if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.error?.message || 'Bad request';
        throw new Error(`Google AI API 400: ${errorMsg}`);
      } else if (error.response?.status === 429) {
        throw new Error('Google AI API 429: Rate limit exceeded. Please wait a moment and try again.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Google AI API timeout - request took too long');
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to Google AI API. Check your internet connection.');
      }

      // If it's already a custom error message, don't wrap it
      if (error.message.includes('Google AI') || error.message.includes('Content was blocked') || error.message.includes('candidates')) {
        throw error;
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
        max_tokens: 8000,
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
          max_new_tokens: 8000,
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
        max_tokens: 8000,
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
        max_tokens: 8000,
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