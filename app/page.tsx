import Link from "next/link";
export default function HomePage() {
  return (
    <main>
      <h1>Task Board</h1>
      <p>Plan your work, one task at a time.</p>
      <Link href="/tasks">View all tasks</Link>
    </main>
  );
}
