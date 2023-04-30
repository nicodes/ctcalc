/**
 * Parses the query parameters of a URL string as JSON and returns them as an object.
 * @param url - The URL string to parse.
 * @returns An object containing the parsed query parameters, or undefined if the URL has no query parameters.
 */
export function parseQueryParams(url: string): Record<string, any> | undefined {
  const queryParamsString = url.split("?")[1];
  if (!queryParamsString) return;

  const queryParamsArray = queryParamsString.split("&");
  const queryParams: Record<string, any> = {};

  // Loop over each key-value pair in the array and parse the value as JSON
  queryParamsArray.forEach((queryParam) => {
    const [key, value] = queryParam.split("=");

    try {
      // Decode the URI-encoded value string and parse it as JSON
      const decodedValue = decodeURIComponent(value);
      const parsedValue = JSON.parse(decodedValue);
      queryParams[key] = parsedValue;
    } catch (err) {
      // If parsing fails, set the key-value pair to the original (unparsed) value
      queryParams[key] = value;
    }
  });

  return queryParams;
}
