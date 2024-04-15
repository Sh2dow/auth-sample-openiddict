const localStorageMock = {
  // ts-expect-error TS(2304): Cannot find name 'jest'.
  getItem: jest.fn(),
  // ts-expect-error TS(2304): Cannot find name 'jest'.
  setItem: jest.fn(),
  // ts-expect-error TS(2304): Cannot find name 'jest'.
  removeItem: jest.fn(),
  // ts-expect-error TS(2304): Cannot find name 'jest'.
  clear: jest.fn(),
};
// @ts-expect-error TS(2304): Cannot find name 'global'.
global.localStorage = localStorageMock;

// Mock the request issued by the react app to get the client configuration parameters.
// @ts-expect-error TS(2322): Type '() => Promise<{ ok: true; json: () => Promis... Remove this comment to see the full error message
window.fetch = () => {
  return Promise.resolve(
    {
      ok: true,
      json: () => Promise.resolve({
        "authority": "https://localhost:7182",
        "client_id": "react-client",
        "redirect_uri": "https://localhost:7182/authentication/login-callback",
        "post_logout_redirect_uri": "https://localhost:7182/authentication/logout-callback",
        "response_type": "id_token token",
        "scope": "API openid profile"
     })
    });
};
