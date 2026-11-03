import { useState, type FormEvent } from "react";
import { CreateTaskSchema, type CreateTaskInput } from "@/lib/schemas";

function NewTaskForm({
  onAddTask,
}: {
  onAddTask: (input: CreateTaskInput) => void;
}) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateTaskInput, string[]>>
  >({});
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<CreateTaskInput["status"]>("open");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = CreateTaskSchema.safeParse({ title, dueDate, status });
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    setErrors({});
    onAddTask(result.data);
    setTitle("");
    setDueDate("");
    setStatus("open");
  }

  return (
    <form className="new-task-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="task-title">Task title</label>
        <input
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "task-title-error" : undefined}
        />
        {errors.title && (
          <p id="task-title-error" className="field-error">
            {errors.title[0]}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="task-due-date">Due date</label>
        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-invalid={!!errors.dueDate}
          aria-describedby={errors.dueDate ? "task-due-date-error" : undefined}
        />
        {errors.dueDate && (
          <p id="task-due-date-error" className="field-error">
            {errors.dueDate[0]}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="task-status">Status</label>
        <select
          id="task-status"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as CreateTaskInput["status"])
          }
          aria-invalid={!!errors.status}
          aria-describedby={errors.status ? "task-status-error" : undefined}
        >
          <option value="open">open</option>
          <option value="doing">doing</option>
          <option value="done">done</option>
        </select>
        {errors.status && (
          <p id="task-status-error" className="field-error">
            {errors.status[0]}
          </p>
        )}
      </div>
      <button type="submit" disabled={title.trim() === ""}>
        Add task
      </button>
    </form>
  );
}

export default NewTaskForm;
