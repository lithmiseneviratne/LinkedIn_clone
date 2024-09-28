// linkedin-auth.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Log the entire event to see if we are receiving the authorization code.
  console.log("Event data:", event);

  const { code } = event.queryStringParameters || {};

  if (!code) {
    console.log("Authorization code is missing");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Authorization code not provided' }),
    };
  }

  console.log("Authorization code received:", code);

  const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
  const clientId = '867639hjcxnxsb';
  const clientSecret = 'ayIjiEN7Uj8zZ4ik';
  const redirectUri = 'https://transcendent-cheesecake-90be30.netlify.app/.netlify/functions/linkedin-auth';

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Access token received:", data.access_token);
      return {
        statusCode: 200,
        body: JSON.stringify({ accessToken: data.access_token }),
      };
    } else {
      console.error("Error fetching access token:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to fetch access token' }),
      };
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
