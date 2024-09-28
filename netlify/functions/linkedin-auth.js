const axios = require('axios');

exports.handler = async (event) => {
    const authorizationCode = event.queryStringParameters.code;
    
    if (!authorizationCode) {
        return {
            statusCode: 400,
            body: "Authorization code not provided",
        };
    }

    // Exchange authorization code for access token
    const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
    const clientId = '867639hjcxnxsb';
    const clientSecret = 'ayIjiEN7Uj8zZ4ik';
    const redirectUri = 'https://transcendent-cheesecake-90be30.netlify.app/.netlify/functions/linkedin-auth';

    try {
        const tokenResponse = await axios.post(tokenUrl, null, {
            params: {
                grant_type: 'authorization_code',
                code: authorizationCode,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret,
            },
        });

        const accessToken = tokenResponse.data.access_token;

        // Redirect to your mobile app with access token
        const appRedirectUrl = `linkedincloneproject://auth/callback?token=${accessToken}`;
        
        return {
            statusCode: 302,
            headers: {
                Location: appRedirectUrl,
            },
        };
    } catch (error) {
        console.error('Error fetching access token:', error);
        return {
            statusCode: 500,
            body: "Error fetching access token",
        };
    }
};
