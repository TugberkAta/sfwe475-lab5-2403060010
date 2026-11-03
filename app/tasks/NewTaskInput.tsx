import { useState } from "react";

// NewTaskInput.tsx
function NewTaskInput({ onAddTask }: { onAddTask: (title: string) => void }) {
  const [text, setText] = useState("");
  function handleAdd() {
    if (text.trim() === "") return;
    onAddTask(text);
    setText("");
  }
  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default NewTaskInput;
