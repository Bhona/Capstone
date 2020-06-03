// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'g3npaazem1'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'bhona.auth0.com', // Auth0 domain
  clientId: '1N8NmsVc9pSiDBJH3xG7UZSCaY7W0KXd', // Auth0 client id
  // clientId: 'AhgaFb7YwmLaT7bmqvAVhhJGx42m1g0B', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
