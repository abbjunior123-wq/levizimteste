const worker = {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    const assetUrl = new URL(request.url);
    if (assetUrl.pathname === "/") assetUrl.pathname = "/index.html";

    let response = await env.ASSETS.fetch(new Request(assetUrl, request));
    if (response.status === 404 && !assetUrl.pathname.includes(".")) {
      assetUrl.pathname = "/index.html";
      response = await env.ASSETS.fetch(new Request(assetUrl, request));
    }

    return response;
  }
};

export default worker;
