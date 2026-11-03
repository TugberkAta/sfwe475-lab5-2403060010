import type { Task } from "./schemas";
const sampleTasks: Task[] = [
  { id: 1, title: "Read Chapter 4", done: false },
  { id: 2, title: "Build NewTaskForm", done: false },
];
type MockOptions = { delayMs?: number; shouldFail?: boolean; empty?: boolean };
export function simulateFetchTasks(options: MockOptions = {}): Promise<Task[]> {
  const { delayMs = 800, shouldFail = false, empty = false } = options;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Mock server error"));
        return;
      }
      resolve(empty ? [] : sampleTasks);
    }, delayMs);
  });
}
