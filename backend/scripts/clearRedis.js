// base/scripts/clearRedis.js
import { Redis } from "../backend/lib/redis.js";
import dotenv from "dotenv";

dotenv.config();

const indexName = process.env.REDIS_DOCUMENT_INDEX;

async function clear() {
    console.log(`🧹 Borrando índice Redis: ${indexName}`);
    await Redis.drop(indexName); // ⚠️ asegúrate que Redis.drop esté implementado
    console.log("✅ Índice borrado.");
    process.exit(0);
}

clear().catch(err => {
    console.error("❌ Error borrando índice:", err);
    process.exit(1);
});
