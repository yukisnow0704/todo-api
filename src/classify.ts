import { VertexAI } from "@google-cloud/vertexai";
import { json } from "node:stream/consumers";

const CATEGORIES = ["仕事", "買い物", "家事", "健康", "学習", "その他"] as const;
const PRIORITIES = ["高", "中", "低"] as const

interface AnalyzeResult {
    category: string;
    priority: string;
    estimatedMinutes: number;
}

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT ?? "my-hono-app-v2",
  location: "us-central1",
});

const model = vertexAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

export async function analyzeTodo(title: string): Promise<AnalyzeResult> {
    const prompt = `次のtodoのタイトルを読んで、以下の3項目をJSON形式で出力してください。
JSON以外の文字は一切出力しないでください。

- category: ${CATEGORIES.join(", ")} のいずれか1つ
- priority: ${PRIORITIES.join(", ")} のいずれか1つ(緊急・重要そうなら高、そうでなければ中か低)
- estimatedMinutes: 完了までにかかりそうな時間(分)の整数値

タイトル: "${title}"

出力例: {"category": "買い物", "priority": "中", "estimatedMinutes": 30}`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (!text) throw new Error("empty response from Vertex AI");

        const jsonText = text.replace(/^```json\s*|\s*```$/g, "");
        const parsed = JSON.parse(jsonText);

        const category = (CATEGORIES as readonly string[]).includes(parsed.category) ? parsed.category : "その他";
        const priority = (CATEGORIES as readonly string[]).includes(parsed.priority) ? parsed.priority : "中";
        const estimatedMinutes = Number.isFinite(parsed.estimatedMinutes) ? Math.max(1, Math.round(parsed.estimatedMinutes)) : 30;

        return { category, priority, estimatedMinutes };
    } catch (error) {
        console.error(JSON.stringify({ event: "analyze_error", message: String(error) }));
        return { category: "その他", priority: "中", estimatedMinutes: 30 };
    }
}