import type { APIRoute } from "astro";

export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    return new Response(
      JSON.stringify({
        body,
      }),
      {
        status: 200,
      }
    );
  }
  return new Response(null, { status: 400 });
};
