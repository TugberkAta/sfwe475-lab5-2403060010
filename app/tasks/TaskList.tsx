import type { Task } from "@/lib/schemas";
import type { TaskFilter } from "./FilterBar";
import TaskCard from "./TaskCard";
function TaskList({
  tasks,
  filter,
  onToggleTask,
}: {
  tasks: Task[];
  filter: TaskFilter;
  onToggleTask: (id: number) => void;
}) {
  const visibleTasks = tasks.filter((task) => {
    if (filter === "done") return task.done;
    if (filter === "open") return !task.done;
    return true;
  });
  return (
    <div>
      {visibleTasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          done={task.done}
          dueDate={task.dueDate}
          status={task.status}
          onToggleTask={onToggleTask}
        />
      ))}
    </div>
  );
}
export default TaskList;
