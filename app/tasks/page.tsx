import { fetchTasks } from "@/lib/tasks";
import TaskBoard from "./TaskBoard";

export default async function TasksPage() {
  const tasks = await fetchTasks();
  console.log("TasksPage is running where? typeof window is", typeof window);
  return <TaskBoard initialTasks={tasks} />;
}
