"use client";

export default function Error({ retry }: { retry: () => void }) {
  return (
    <div>
      <p>We could not load your tasks.</p>
      <button onClick={() => retry()}>Try again</button>
    </div>
  );
}
