import { getResults } from "../../utils/inactivation";
import { parseQueryParams } from "../../utils/parseQueryParams";
import { validate } from "../../utils/validate";

export async function get({ params, request }) {
  const queryParams = parseQueryParams(request.url);
  const [validatedParams, error] = validate(queryParams);

  if (error)
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });

  const results = getResults(validatedParams);
  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
