import { copyFile, mkdir, rm, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "dist");

// Arquivos obrigatórios da landing page.
const publicFiles = [
  "index.html",
  "styles.css",
  "script.js",
  "hero-capela-web.jpg",
  "hero-higgsfield-web.mp4",
  "hero-higgsfield-poster.jpg",
  "hero-real-short.mp4",
  "stage-smoke-wide-web.mp4",
  "stage-smoke-close-web.mp4",
  "crowd-toast-web.mp4",
  "crowd-toast-poster.jpg",
  "levizim-logo.png",
  "levizim-social-card.jpg",
  "whatsapp.svg",
  "levizim-extract-07.jpg",
  "anonyig.io_Instagram_levizimoficial_3760670637326154932_384913745.jpeg",
  "casal-brinde.jpg",
  "pista-aerea.jpg",
  "levizim-show-wide-web.jpg",
  "levizim-show-vertical-web.jpg",
  "levizim-palco.jpg",
  "levizim-noivos.jpg",
  "festa-energia.jpg",
  "festa-noiva-roda.jpg",
  "levizim-conexao-noiva.jpg"
];

// Arquivos opcionais: entram no pacote se existirem, sem quebrar o build.
// Basta soltar "microfone-web.mp4" nesta pasta para publicar o vídeo real do microfone.
const optionalFiles = [
  "microfone-web.mp4"
];

const exists = async (file) => {
  try {
    await access(resolve(root, file));
    return true;
  } catch {
    return false;
  }
};

await rm(output, { recursive: true, force: true });
await mkdir(resolve(output, "client"), { recursive: true });
await mkdir(resolve(output, "server"), { recursive: true });

const optionalPresent = [];
for (const file of optionalFiles) {
  if (await exists(file)) optionalPresent.push(file);
}

const filesToCopy = [...publicFiles, ...optionalPresent];
await Promise.all(
  filesToCopy.map((file) => copyFile(resolve(root, file), resolve(output, "client", file)))
);
await copyFile(resolve(root, "worker", "index.js"), resolve(output, "server", "index.js"));

console.log(`Built ${filesToCopy.length} public files.`);
if (optionalPresent.length) console.log(`  incluídos opcionais: ${optionalPresent.join(", ")}`);
