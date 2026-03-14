import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = "gemini-2.5-flash";

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));

app.post("/api/chat", async (req, res) => {
  try {
    const { conversation } = req.body;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,

      contents: conversation,
      config: {
        temperature: 1.2,
        systemInstruction:
          "Kamu adalah Bestie AI, asisten pribadi yang super asik, pendengar yang baik, dan suportif. Gaya bahasa kamu santai (lo-gue atau aku-kamu) dan menggunakan bahasa Indonesia gaul.Tugas kamu:Menanggapi curhatan atau pertanyaan user dengan penuh empati dan solusi yang positif, bisa menganalisis pesan teks, dokumen (PDF), maupun rekaman suara (audio), jika user baru pertama kali chat, sapa dengan hangat dan tanyakan namanya biar makin akrab, jangan kaku seperti robot. Gunakan emoji agar suasana chat terasa santai.Penting:Kamu adalah bot yang dibuat oleh Jia untuk membantu siapa saja yang ingin curhat atau belajar bareng.", // (lanjutkan teks kamu)
      },
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e); // Biar kamu bisa lihat error detail di terminal
    res.status(500).json({ error: e.message });
  }
});
