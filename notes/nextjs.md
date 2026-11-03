# Next.js route predictions

- A file at `app/tasks/page.tsx` will answer requests to `/tasks`.
- Visiting `/task` (singular) will show a 404 because there is no matching route.

The `console.log` for `/tasks/1` appeared in the terminal running `npm run dev`, not the browser console. The `id` had type `string` and value `"1"`. This appeared in the terminal because the page is a Server Component by default, so its code runs on the server; the route parameter comes from a URL segment and is a string.

The `lang="en"` attribute on `<html>` tells screen readers which language the page is in, so they choose the right voice and pronunciation rules instead of reading English text with the wrong accent or rules.

## Route check against the five URL rules

| Route | HTTPS | Short and readable | Lowercase | Hyphens, not underscores | Few query parameters |
| --- | --- | --- | --- | --- | --- |
| `/` | at deployment | Yes | Yes | Yes (no word separators needed) | Yes (none) |
| `/tasks` | at deployment | Yes | Yes | Yes (single word) | Yes (none) |
| `/tasks/[id]` (e.g. `/tasks/1`) | at deployment | Yes | Yes | Yes (no word separators needed) | Yes (id is a path segment, not a query parameter) |

## Nested layouts

Two layouts wrap `/tasks/1`: the root layout (`app/layout.tsx`) and the tasks layout (`app/tasks/layout.tsx`). When going from `/tasks` to `/tasks/1`, both layouts stay in place, including the tasks layout with its "Your tasks" heading; only the page inside it changes.

## Deliberate mistake: rendering TaskBoard from a Server Component

**Prediction:** `app/tasks/page.tsx` is a Server Component, and `TaskBoard.tsx` has no `"use client"` line, so it is treated as a Server Component too. `TaskBoard` uses `useState`, `useEffect` and `useCallback`, which only work in Client Components, so I expect `/tasks` to fail with an error saying these hooks cannot be used in a Server Component.

**What happened:** `/tasks` returned a 500 error. The message was:

```
You're importing a module that depends on `useEffect` into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the `"use client"` directive.
    Learn more: https://nextjs.org/docs/app/api-reference/directives/use-client
> 1 | import { useCallback, useEffect, useState } from "react";
    |                       ^^^^^^^^^
  2 | import type { CreateTaskInput, Task } from "@/lib/schemas";
  3 | import TaskList from "./TaskList";
  4 | import NewTaskForm from "./NewTaskForm";

Ecmascript file had an error

Import trace:
  Server Component:
    ./app/tasks/TaskBoard.tsx
    ./app/tasks/page.tsx
```

**What it is telling me:** Every file in `app/` is a Server Component unless it says otherwise, so when `page.tsx` imported `TaskBoard.tsx`, `TaskBoard` was treated as server code too. Hooks like `useEffect` and `useState` need a browser and a component that re-renders on the client, so they cannot run on the server. The import trace shows the path that pulled the hook into server code (`page.tsx` → `TaskBoard.tsx`), and the fix is to put `"use client"` at the top of `TaskBoard.tsx` so it and everything it imports run in the browser.

## Where TasksPage runs

The `console.log` from `TasksPage` appeared in the terminal running `npm run dev`, not in the browser console, and `typeof window` was `"undefined"`. This shows that a Server Component runs only on the server, in Node.js, where browser objects like `window` do not exist, and the browser receives only the HTML it produces.

## View source: Next.js vs the Lab 4 Vite app

| | Next.js `/tasks` | Lab 4 Vite app |
| --- | --- | --- |
| Task titles in the raw HTML? | Yes: "Read Chapter 4" and "Build NewTaskForm" are in the source, under the "Your tasks" heading | No: the body is only an empty `<div id="root"></div>` and a `<script>` tag |

**Why:** In Next.js, `TasksPage` runs on the server, fetches the tasks and renders the components to HTML before sending the page, so the titles are already in the document the browser receives. The Vite app sends an empty shell, and the tasks only appear after the browser downloads the JavaScript, React renders into `#root` and the tasks are fetched. That is why view source (which shows the original HTML, not the live DOM) shows no tasks.

## Server or Client?

| File | Server or Client? | Reason |
| --- | --- | --- |
| `app/layout.tsx` | Server | It has no `"use client"` line and only renders static markup and links, so it stays a Server Component by default. |
| `app/tasks/page.tsx` | Server | It has no `"use client"` line and is an async component that awaits `fetchTasks()` on the server, which is why its `console.log` shows `typeof window` as `"undefined"`. |
| `TaskBoard.tsx` | Client | It starts with `"use client"` because it holds the `tasks` and `filter` state with `useState`, which only works in the browser. |
| `TaskList.tsx` and `TaskCard.tsx` | Client | They have no `"use client"` line and no hooks of their own, but they are imported by `TaskBoard`, so they are part of its client bundle. |
| `FilterBar.tsx` and `NewTaskForm.tsx` | Client | They are interactive (`onClick` buttons, and `useState` with `onChange`/`onSubmit` in the form) and are imported by `TaskBoard`, so they run in the browser without needing their own `"use client"` line. |

**Which files needed `"use client"` written in them?** Only `TaskBoard.tsx`. It is the boundary between server and client code, because the server page renders it and it uses state.

**Which are client code only because a parent imports them?** `TaskList.tsx`, `TaskCard.tsx`, `FilterBar.tsx` and `NewTaskForm.tsx` (and `TaskCheckbox.tsx`, which `TaskCard` imports). Everything imported from a `"use client"` file becomes client code too, so these files do not need the directive themselves.

## loading.tsx vs the Lab 4 loading state

With `delayMs` raised to 1500, reloading `/tasks` showed the navigation bar, the "Your tasks" heading and "Loading tasks..." straight away. About 1.5 seconds later the task list replaced the loading message, without a second request from the browser.

| | Next.js `loading.tsx` | Lab 4 |
| --- | --- | --- |
| Who shows the loading state | The server sends it as HTML in the first part of the response | The browser shows it after downloading and running the JavaScript |
| How it is written | A separate `loading.tsx` file; Next.js wraps the page in a `<Suspense>` boundary with it as the fallback | A `status` state (`"loading" \| "success" \| "empty" \| "error"`) and an `if` that returns the loading message |
| How the data arrives | The server keeps the same response open and streams the tasks into the page when `fetchTasks()` finishes | `useEffect` calls the mock API from the browser after the first render, then `setStatus` swaps the message for the list |
| Layout while waiting | The layouts (navigation bar, "Your tasks" heading) are already on screen | Only what `TaskBoard` returns, inside an empty `#root` until the JavaScript runs |

Next.js can show the loading state earlier because the server sends it without waiting for any client JavaScript, and the page code stays simpler because it no longer has to track loading by hand.

## error.tsx

In this Next.js version (16.4) the error component receives `error` and `retry` (stable since 16.3). `retry()` re-fetches and re-renders the segment, so the server tries `fetchTasks()` again. The older `reset()` still exists but only re-renders without re-fetching, so after a server fetch failure it would show the same error again.

**Why an error file must be a Client Component:** Next.js wraps the route segment in a React error boundary, and error boundaries only exist in React running in the browser, where they catch the error and swap in the fallback UI. The error screen also has to respond to a click on "Try again" with an `onClick` handler, and event handlers only work in Client Components, so `error.tsx` needs `"use client"`.

## Build output: how each route is rendered

From `npm run build` (Next.js 16.4.4, Cache Components enabled):

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ◐ /tasks
└   /tasks/[id]
  └ ◐ /tasks/[id]


○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

`/tasks` is **not** listed as static. It is a Partial Prerender (◐): the parts that never change (the navigation bar, the "Your tasks" heading and the "Loading tasks..." fallback from `loading.tsx`) are built once as static HTML, and the task list is fetched and streamed in on every request. That is the right choice for data that changes, so new tasks show up on the next page load.

If `/tasks` had been fully static (○), the task list would be fetched once at build time and frozen into the HTML. If the tasks changed every minute, every visitor would keep seeing the old list from the last build until the site was rebuilt and redeployed.

## Try it: server, browser or ahead of time?

| Page | Where to render | Must search engines see it? | Private and highly interactive? |
| --- | --- | --- | --- |
| (a) Public page for one shared task | **Server** | Yes: it is public and people may find it through search, so the content must be in the HTML. | No: anyone can view it and it is mostly read-only, but the task can change, so it should be rendered fresh on each request rather than once at build time. |
| (b) Drag-and-drop planning board | **Browser** | No: it shows one user's own plan, so there is nothing for search engines to index. | Yes: it is private and changes with every drag, so it should run in the browser where it can respond instantly. |
| (c) About page | **Ahead of time** | Yes: it is public and should be easy to find. | No: it is the same for everyone and rarely changes, so it can be built once at build time and served as static HTML. |

## Link attributes in the footer

- `rel="sponsored"` tells a search engine the link is paid or an advertisement, so it should not count as a genuine recommendation of that site.
- `rel="ugc"` tells a search engine the link was added by a user (user-generated content), so the site owner is not vouching for where it points.

## Stretch: force-dynamic

Adding `export const dynamic = "force-dynamic";` to `app/tasks/page.tsx` made the build fail, so there was no new route table to compare:

```
Error: Route segment config "dynamic" is not compatible with `nextConfig.cacheComponents`. Please remove it.
```

The Next.js docs ("Migrating to Cache Components", section `dynamic = "force-dynamic"`) say to remove the config. With Cache Components on, uncached data already runs at request time and Next.js prerenders only the static parts around it, which is exactly what the ◐ (Partial Prerender) symbol for `/tasks` in the saved route table already shows. I removed the line again so the build passes.

## Experiment: browser-rendered /tasks-csr vs server-rendered /tasks

View source showed the difference clearly. On `/tasks` the task titles, the page's own `<title>` ("All tasks | Task Board"), the description and the canonical link were all in the raw HTML. On `/tasks-csr` the raw HTML only had "Loading tasks..." and the site-wide `<title>` ("Task Board"), with no task titles and no canonical link, because the list is fetched and drawn in the browser after the JavaScript runs. The build also listed `/tasks-csr` as fully static (○): only the empty loading shell was prerendered, not the tasks.

For a public page I would choose the server-rendered `/tasks`. Search engines and link previews get the real content and metadata in the first response without running any JavaScript. Visitors also see the tasks sooner, because the browser does not have to download and run the JavaScript and then make a second request before anything useful appears. A browser-rendered page only makes sense for something private and highly interactive, where search engines do not matter. Having both pages online would also mean two URLs showing the same content, which is the duplicate-content problem the canonical tag exists to solve, so I deleted the experiment.

(Lighthouse could not be run from my setup; scores still to be added after running it in Chrome DevTools.)
