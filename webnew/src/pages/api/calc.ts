import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    console.log(body);
    //     return new Response(
    //       JSON.stringify({
    //         message: "Your name was: " + name,
    //       }),
    //       {
    //         status: 200,
    //       }
    //     );
    //   }
  }

  return new Response(null, { status: 200 });
};
