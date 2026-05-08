export async function internalFetch(method, url,  body, onResponseSuccess, onResponseFailure) {

    const headers = { Accept: 'application/json' };
    if (body !== null) {
      headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(
      import.meta.env.VITE_GATEWAY_API + url,
      {
        method: method,
        headers,
        body: body ? JSON.stringify(body) : null,
        credentials: 'include',
      }
    );
    const data = await response.json();

    if (response.ok) {
      onResponseSuccess(data);
    } else {
      onResponseFailure(data, response);
    }
    return { data, response };
} 


export const getErrorMessage = (data, response) => {
  if (data && data.message) return data.message;
  if (response.status >= 500) return 'There was a problem communicating with the server.';
  return `An unknown error occurred (${response.status}).`;
}