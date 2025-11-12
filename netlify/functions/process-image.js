exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { image } = JSON.parse(event.body || '{}');
    if (!image) {
      return { statusCode: 400, body: 'Missing image data' };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in Netlify environment');
      return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error' }) };
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: image,
            },
          },
          {
            text: `From the provided image, extract the MAC Address, GPON-SN, and D-SN. Return the result as a JSON object with keys 'macAddress', 'gponSn', and 'dSn'. If a value is not found, return an empty string for that key.`
          }
        ]
      }]
    };

    const apiResponse = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        console.error('Gemini API Error:', errorBody);
        return { statusCode: apiResponse.status, body: JSON.stringify({ error: 'Gemini API request failed' }) };
    }

    const responseData = await apiResponse.json();
    
    const text = responseData.candidates[0].content.parts[0].text;
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedJson = JSON.parse(jsonString);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedJson),
    };
  } catch (error) {
    console.error('Error in Netlify function:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to process image due to an internal error' }) };
  }
};
