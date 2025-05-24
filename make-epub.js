/**
 * make-epub.js
 * Called from n8n Execute Command node:
 *    node /data/scripts/make-epub.js /tmp/book.json
 * 
 * Input JSON schema:
 * {
 *   "meta": { "title": "...", "author": "...", "cover": "cover.png" | null },
 *   "chapters": [
 *      { "title": "Chương 1", "content": "<h2>...</h2><p>...</p>", "images": [ { "name": "img1.png", "data": "<base64>" } ] },
 *      ...
 *   ]
 * }
 */

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import Epub from "epub-gen-memory";

async function main() {
  const jsonPath = process.argv[2];
  if (!jsonPath) {
    console.error("JSON path missing");
    process.exit(1);
  }

  const config = JSON.parse(await fs.promises.readFile(jsonPath));
  const imagesDir = "/tmp/images";
  fs.mkdirSync(imagesDir, { recursive: true });

  // save images
  const chaptersWithImages = config.chapters.map((ch) => {
    const imgs = (ch.images || []).map((img) => {
      const filename = img.name || uuidv4() + ".png";
      fs.writeFileSync(path.join(imagesDir, filename), Buffer.from(img.data, "base64"));
      return { filename, htmlTag: `<img src="images/${filename}" alt="Illustration"/>` };
    });
    const body = ch.content + imgs.map((i) => i.htmlTag).join("\n");
    return { title: ch.title, data: body };
  });

  const options = {
    title: config.meta.title,
    author: config.meta.author,
    lang: "vi",
    publisher: config.meta.publisher || "Self‑publish",
    cover: config.meta.cover || undefined,
    content: chaptersWithImages,
    appendChapterTitles: false,
    verbose: false,
  };

  const epubBuffer = await new Epub(options).promise;
  const outputPath = "/tmp/book.epub";
  fs.writeFileSync(outputPath, epubBuffer);
  console.log("EPUB written to", outputPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});