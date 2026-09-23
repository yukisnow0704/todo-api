import { VertexAI } from "@google-cloud/vertexai";

const CATEGORIES = ["仕事", "買い物", "家事", "健康", "学習", "その他"] as const;

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT ?? "my-hono-app-v2",
  location: "us-central1",
});

const model = vertexAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

export async function classifyTitle(title: string): Promise<string> {
    const prompt = `次のtodoのタイトルを読んで、以下のカテゴリの中から最も当てはまるものを1つだけ選んでください。
カテゴリ以外の文字は一切出力しないでください。

カテゴリ: ${CATEGORIES.join(", ")}

タイトル: "${title}"`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if(text && (CATEGORIES as readonly string[]).includes(text)) {
            return text;
        }
        return "その他";
    } catch (error) {
        console.error(JSON.stringify({ event: "classify_error", message: String(error) }));
        return "その他";
    }
}