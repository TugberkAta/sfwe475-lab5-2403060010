import { z } from "zod";
import { TaskSchema } from "./schemas";
import { simulateFetchTasks } from "./mockApi";
export async function fetchTasks() {
  const raw = await simulateFetchTasks({ delayMs: 300, shouldFail: false });
  return z.array(TaskSchema).parse(raw);
}
export async function getTask(id: number) {
  const tasks = await fetchTasks();
  return tasks.find((t) => t.id === id) ?? null;
}
