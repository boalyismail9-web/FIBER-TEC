// This needs to be installed in your Netlify environment or bundled.
// For simple setups, Netlify often handles dependencies from package.json.
// Ensure `@google/genai` is in your `package.json`.
const { GoogleGenAI, Type } = require("@google/genai");

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { image, apiKey: clientApiKey } = JSON.parse(event.body || '{}');
    if (!image) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing image data' }) };
    }

    // Use the key from the client if provided, otherwise fall back to environment variable.
    const apiKey = clientApiKey || process.env.API_KEY;
    
    if (!apiKey) {
      console.error('API key is missing from both client request and Netlify environment.');
      return { statusCode: 400, body: JSON.stringify({ error: 'مفتاح API مطلوب. يرجى تعيينه في الإعدادات.' }) };
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: image,
            },
          },
          {
            text: `From the provided image of equipment labels, extract the MAC Address, GPON-SN, and D-SN. Return the result as a JSON object. If a value is not found, return an empty string for that key.`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            macAddress: { type: Type.STRING },
            gponSn: { type: Type.STRING },
            dSn: { type: Type.STRING },
          },
        },
      },
    });
    
    const jsonText = response.text.trim();
    const extractedData = JSON.parse(jsonText);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(extractedData),
    };

  } catch (error) {
    console.error('Error in Netlify function:', error);
    // Check for specific API key related errors from Google
    if (error.message && error.message.includes('API key not valid')) {
       return { 
        statusCode: 401, 
        body: JSON.stringify({ error: 'مفتاح API المقدم غير صالح.' }) 
      };
    }
    return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'فشل في معالجة الصورة بسبب خطأ داخلي.' }) 
    };
  }
};