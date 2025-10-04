// base/scripts/clearRedis.js
import { Redis } from "../backend/lib/redis.js";
import dotenv from "dotenv";

dotenv.config();

const indexName = process.env.REDIS_DOCUMENT_INDEX;

async function clear() {
    try {
        console.log(`🧹 Borrando índice Redis: ${indexName}`);
        if (Redis.drop) {
            // si tu lib/redis.js implementa drop()
            await Redis.drop(indexName);
        } else {
            // fallback: eliminar documentos directamente
            await Redis.client.ft.dropIndex(indexName, { DD: true });
        }
        console.log("✅ Índice borrado.");
    } catch (err) {
        console.error("❌ Error borrando índice:", err);
    } finally {
        if (Redis.client) {
            await Redis.client.quit();
            console.log("🔌 Conexión Redis cerrada");
        }
    }
}

clear();
