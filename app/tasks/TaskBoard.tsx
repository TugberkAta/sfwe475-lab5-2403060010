"use client";

import { useState } from "react";
import type { CreateTaskInput, Task } from "@/lib/schemas";
import TaskList from "./TaskList";
import NewTaskForm from "./NewTaskForm";
import FilterBar from "./FilterBar";

export default function TaskBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<"all" | "done" | "open">("all");

  function handleAddTask(input: CreateTaskInput) {
    setTasks([
      ...tasks,
      {
        id: Math.max(0, ...tasks.map((task) => task.id)) + 1,
        title: input.title,
        done: input.status === "done",
        dueDate: input.dueDate || undefined,
        status: input.status,
      },
    ]);
  }

  function handleToggleTask(id: number) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }

  if (tasks.length === 0) {
    return <p>No tasks yet. Add your first one below.</p>;
  }

  return (
    <div>
      <NewTaskForm onAddTask={handleAddTask} />
      <FilterBar filter={filter} onFilterChange={setFilter} />
      <TaskList tasks={tasks} filter={filter} onToggleTask={handleToggleTask} />
    </div>
  );
}
