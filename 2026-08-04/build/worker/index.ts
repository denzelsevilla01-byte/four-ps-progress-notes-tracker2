import handler from "vinext/server/app-router-entry";

const emptyRoster = {
  asOf: "Not loaded",
  meta: {
    households: 0,
    members: 0,
    statuses: { "Roster unavailable": 0 },
    barangays: { "Roster unavailable": 0 },
  },
  households: [],
};

function rosterScript(body: string) {
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "private, no-store, max-age=0",
      "x-robots-tag": "noindex, nofollow, noarchive",
      "referrer-policy": "no-referrer",
    },
  });
}

function setupError(message: string) {
  return rosterScript(
    `window.ROSTER_SETUP_ERROR=${JSON.stringify(message)};window.ROSTER_DATA=${JSON.stringify(emptyRoster)};`,
  );
}

async function serveRoster(env: any, ctx: any) {
  // Cloudflare Access attaches ctx.access only after a request has passed an
  // Access policy. This prevents the roster from becoming a public asset even
  // though the Worker itself has a workers.dev URL.
  if (!ctx?.access) {
    return setupError(
      "Cloudflare Access has not authenticated this request. Protect this Worker with Access and sign in with an authorized account.",
    );
  }

  if (!env?.DB) {
    return setupError(
      "The secure roster database is not connected yet. Create the D1 database, import the roster package, bind it as DB, and redeploy.",
    );
  }

  try {
    const result = await env.DB
      .prepare("SELECT payload FROM roster_chunks ORDER BY chunk_no")
      .all();
    const rows = Array.isArray(result?.results) ? result.results : [];
    if (!rows.length) {
      return setupError(
        "The D1 database is connected but contains no roster data. Import the generated San Fabian roster D1 package.",
      );
    }

    const payload = rows.map((row: any) => String(row.payload ?? "")).join("");
    if (!payload.startsWith("{") || !payload.endsWith("}")) {
      return setupError("The roster payload in D1 is incomplete or corrupted. Re-import the roster package.");
    }

    return rosterScript(`window.ROSTER_DATA=${payload};`);
  } catch (error) {
    console.error("Secure roster load failed", error);
    return setupError(
      "The secure roster database could not be read. Check the DB binding and D1 import, then redeploy.",
    );
  }
}

export default {
  async fetch(request: Request, env: any, ctx: any) {
    const url = new URL(request.url);

    if (url.pathname === "/api/roster.js") {
      return serveRoster(env, ctx);
    }

    const response = await handler.fetch(request, env, ctx);
    const secured = new Response(response.body, response);
    secured.headers.set("x-robots-tag", "noindex, nofollow, noarchive");
    secured.headers.set("referrer-policy", "no-referrer");
    return secured;
  },
};
