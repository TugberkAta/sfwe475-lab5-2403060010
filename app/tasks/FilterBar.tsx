export type TaskFilter = "all" | "done" | "open";

function FilterBar({
  filter,
  onFilterChange,
}: {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}) {
  return (
    <div className="filter-bar">
      <button
        type="button"
        aria-pressed={filter === "all"}
        onClick={() => onFilterChange("all")}
      >
        All
      </button>
      <button
        type="button"
        aria-pressed={filter === "done"}
        onClick={() => onFilterChange("done")}
      >
        Done
      </button>
      <button
        type="button"
        aria-pressed={filter === "open"}
        onClick={() => onFilterChange("open")}
      >
        Open
      </button>
    </div>
  );
}

export default FilterBar;
