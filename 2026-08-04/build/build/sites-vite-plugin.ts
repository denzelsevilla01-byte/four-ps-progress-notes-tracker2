import { access, cp, mkdir, rm, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

async function exists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export function sites(): Plugin {
  let root = process.cwd();

  return {
    name: "sites",
    apply: "build",
    configResolved(config) {
      root = config.root;
    },
    async closeBundle() {
      const out = resolve(root, "dist", ".openai");
      await rm(out, { recursive: true, force: true });
      await mkdir(out, { recursive: true });

      const config = resolve(root, ".openai", "hosting.json");
      if (await exists(config)) {
        await cp(config, resolve(out, "hosting.json"));
      }

      const rosterOut = resolve(root, "dist", "client", "roster");
      await mkdir(rosterOut, { recursive: true });
      await cp(resolve(root, "outputs"), rosterOut, { recursive: true });

      // The roster is no longer copied from a developer's local Windows Temp
      // directory. Production loads it from an authenticated Worker endpoint,
      // backed by the private Cloudflare D1 DB binding.
      const prototype = resolve(rosterOut, "san-fabian-roster-prototype.html");
      if (await exists(prototype)) {
        const html = await readFile(prototype, "utf8");
        const secureHtml = html
          .replace(
            'file:///C:/Users/WINDOWS/AppData/Local/Temp/sf-roster-refresh.js',
            '/api/roster.js',
          )
          .replace('san-fabian-roster-data.js', '/api/roster.js');
        await writeFile(prototype, secureHtml);
      }
    },
  };
}
