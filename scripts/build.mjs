import { copyFile, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "dist");
const publicFiles = [
  "index.html",
  "styles.css",
  "script.js",
  "hero-higgsfield-web.mp4",
  "hero-higgsfield-poster.jpg",
  "hero-real-short.mp4",
  "levizim-extract-07.jpg",
  "anonyig.io_Instagram_levizimoficial_3760670637326154932_384913745.jpeg",
  "casal-brinde.jpg",
  "pista-aerea.jpg",
  "levizim-show-wide-web.jpg",
  "levizim-show-vertical-web.jpg",
  "levizim-palco.jpg",
  "levizim-noivos.jpg",
  "festa-energia.jpg"
];

await rm(output, { recursive: true, force: true });
await mkdir(resolve(output, "client"), { recursive: true });
await mkdir(resolve(output, "server"), { recursive: true });

await Promise.all(
  publicFiles.map((file) => copyFile(resolve(root, file), resolve(output, "client", file)))
);
await copyFile(resolve(root, "worker", "index.js"), resolve(output, "server", "index.js"));

console.log(`Built ${publicFiles.length} public files.`);
