import { vi } from "vitest";

vi.mock("./tasks.js", () => ({
    enqueueAnalyzeTodoTask: vi.fn().mockResolvedValue(undefined),
}));

import { CloudTasksClient } from "@google-cloud/tasks";

const tasksClient = new CloudTasksClient();

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT ?? "my-hono-app-v2";
const LOCATION = "asia-northeast1"
const QUEUE_NAME = process.env.TASKS_QUEUE_NAME ?? "analyze-todo-queue";
const WORKER_URL = process.env.WORKER_URL ?? "";
const WORKER_SELRET = process.env.WORKER_SECRET ?? "";

export async function enqueueAnalyzeTodoTask(todoId: number, title: string): Promise<void> {
    const parent = tasksClient.queuePath(PROJECT_ID, LOCATION, QUEUE_NAME);

    const payload = JSON.stringify({ todoId, title });

    await tasksClient.createTask({
        parent,
        task: {
            httpRequest: {
                httpMethod: "POST",
                url: `${WORKER_URL}/internal/tasks/analyze-todo`,
                Headers: {
                    "Content-Type": "application/json",
                    "X-Worker-Secret": WORKER_SELRET,
                },
                body: Buffer.from(payload).toString("base64"),
            },
        },
    });
}
