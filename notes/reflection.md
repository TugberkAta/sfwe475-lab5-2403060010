# Reflection

## 4. Why is `app/tasks/page.tsx` a Server Component but `TaskBoard` a Client Component?

Every file in `app/` is a Server Component by default, and `app/tasks/page.tsx` has no `"use client"` line. It only needs to fetch the tasks with `await fetchTasks()` and pass them on, which works on the server. `TaskBoard` has `"use client"` because it holds the `tasks` and `filter` state with `useState` and responds to clicks and form input, and that only works in the browser.

## 5. What did view source show on `/tasks` compared with the Lab 4 Vite app, and why?

On `/tasks` view source showed the task titles ("Read Chapter 4", "Build NewTaskForm") already in the HTML, together with the page title, description and canonical link. The Lab 4 Vite app only showed an empty `<div id="root"></div>` and a script tag. Next.js renders the page on the server and sends finished HTML, while Vite sends an empty page and the tasks only appear after the browser runs the JavaScript and fetches them.

## 6. A teammate creates a page at `/Tasks/Project_Plan`. Which two URL rules does it break, and what would you rename it to?

It breaks the lowercase rule (`Tasks`, `Project`, `Plan` have capital letters) and the hyphens-not-underscores rule (`Project_Plan` uses an underscore). I would rename it to `/tasks/project-plan`, by putting the page at `app/tasks/project-plan/page.tsx`.
