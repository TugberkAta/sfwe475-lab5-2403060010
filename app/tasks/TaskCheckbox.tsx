type TaskCheckboxProps = {
  done: boolean;
  onToggle: () => void;
};

function TaskCheckbox({ done, onToggle }: TaskCheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={done}
      onChange={onToggle}
      aria-label={done ? "Mark task as not done" : "Mark task as done"}
    />
  );
}

export default TaskCheckbox;
