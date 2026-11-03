import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>We could not find that page.</p>
      <Link href="/tasks">Back to all tasks</Link>
    </main>
  );
}
