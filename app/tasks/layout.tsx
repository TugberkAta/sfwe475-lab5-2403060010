export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <h1>Your tasks</h1>
      {children}
    </section>
  );
}
