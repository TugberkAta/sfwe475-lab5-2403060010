import { fetchTasks } from "@/lib/tasks";
import TaskBoard from "./TaskBoard";

export const metadata = {
  title: "All tasks | Task Board",
  description: "Every task on your board, in one place.",
  alternates: { canonical: "https://taskboard.example/tasks" },
};

export default async function TasksPage() {
  const tasks = await fetchTasks();
  console.log("TasksPage is running where? typeof window is", typeof window);
  return <TaskBoard initialTasks={tasks} />;
}
