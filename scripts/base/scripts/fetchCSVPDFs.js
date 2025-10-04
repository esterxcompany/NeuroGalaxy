// base/scripts/fetchCSVPDFs.js
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import axios from "axios";

import { processPdf } from "../backend/bin/context.js"; // exporta processPdf en context.js

const assetsDir = path.resolve("base/backend/assets");

// Descargar PDF y guardarlo en assets/
async function downloadAndSavePDF(url, filename) {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const filePath = path.join(assetsDir, filename);
    fs.writeFileSync(filePath, Buffer.from(response.data));
    return filePath;
}

async function processCSV(csvPath) {
    const links = [];

    await new Promise((resolve, reject) => {
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on("data", (row) => {
                if (row.link) links.push(row.link); // columna "link"
            })
            .on("end", resolve)
            .on("error", reject);
    });

    for (const [i, link] of links.entries()) {
        const filename = `doc_${i + 1}.pdf`;
        console.log(`⬇️  Descargando: ${link}`);
        const filePath = await downloadAndSavePDF(link, filename);

        console.log(`📂 Guardado en: ${filePath}`);
        await processPdf(filePath);
    }

    console.log("🚀 Todos los PDFs descargados y procesados.");
}

const csvPath = path.join(path.resolve("base/scripts"), "links_pdfs.csv");
processCSV(csvPath).catch((err) => {
    console.error("❌ Error en el proceso:", err);
    process.exit(1);
});
