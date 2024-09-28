const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    // Parse the incoming request
    const { code } = event.queryStringParameters || {};

    // Check if the authorization code is provided
    if (!code) {
      console.error("Authorization code is missing from the request.");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Authorization code not provided' }),
      };
    }

    console.log("Authorization code received:", code);

    // LinkedIn access token URL and credentials
    const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
    const clientId = '867639hjcxnxsb';  // Use your LinkedIn Client ID
    const clientSecret = 'ayIjiEN7Uj8zZ4ik';  // Use your LinkedIn Client Secret
    const redirectUri = 'https://transcendent-cheesecake-90be30.netlify.app/.netlify/functions/linkedin-auth';  // Your LinkedIn Redirect URI

    // Prepare the request body for exchanging the authorization code for an access token
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    });

    // Make the request to LinkedIn to fetch the access token
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    // Handle the response from LinkedIn
    const data = await response.json();

    if (response.ok) {
      console.log("Access token received successfully:", data.access_token);
      return {
        statusCode: 200,
        body: JSON.stringify({ accessToken: data.access_token }),
      };
    } else {
      console.error("Error fetching access token:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error_description || 'Failed to fetch access token' }),
      };
    }

  } catch (error) {
    console.error("Unexpected error occurred:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
