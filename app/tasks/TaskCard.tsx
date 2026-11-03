import Link from "next/link";
import type { Task } from "@/lib/schemas";
import TaskCheckbox from "./TaskCheckbox";
type TaskCardProps = Pick<
  Task,
  "id" | "title" | "done" | "dueDate" | "status"
> & {
  onToggleTask: (id: number) => void;
};
function TaskCard({
  id,
  title,
  done,
  dueDate,
  status,
  onToggleTask,
}: TaskCardProps) {
  return (
    <div className="task-card">
      <h2>
        <Link href={`/tasks/${id}`}>{title}</Link>
      </h2>
      {status && <p>Status: {status}</p>}
      {dueDate && <p>Due: {dueDate}</p>}
      <TaskCheckbox done={done} onToggle={() => onToggleTask(id)} />
    </div>
  );
}
export default TaskCard;
