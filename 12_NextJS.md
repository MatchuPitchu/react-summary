# Next.js - React Framework for Production

> <https://nextjs.org/>

- fullstack framework that builds up on React
- has built-in features (e.g. routing) that help you solve common problems & clear guidance on how to use those features

## Key Features & Benefits

- `Server-side Rendering`:
  - preparing content of page on server-side instead of client-side
  - good for SEO and initial load
- `File-based Routing`:
  - define pages and routes with files and folders instead of code
  - less code, less work, highly understandable -> no additional `React Router DOM` package to set up
- `Fullstack Capabilites`:
  - allows to add backend API (server-side) code directly into Next project
  - storing data, getting data, authentication etc. can be added to Next project

## Routing

- Routing according to Folder Structure

  - basic home file is always `pages/index.tsx` -> `my-domain.de`
  - `pages/news.tsx` OR `pages/news/index.tsx` -> `my-domain.de/news`
  - to organize nested paths: `pages/news/nested-path.tsx` OR `pages/news/nested-path/index.tsx` -> `my-domain.de/news/nested-path`
  - and so on and so on ...

- Create Dynamic Path

  - name file like `[SOME_NAME].tsx` to create dynamic path like `my-domain.de/news/:id`
  - to extract dynamic value, use `useRouter` hook and property `router.query.YOUR-DYNAMIC-FILENAME`

  ```TSX
  import type { NextPage } from 'next';
  import { useRouter } from 'next/router';

  const NewsItem: NextPage = () => {
    const router = useRouter();
    const newsId = router.query.dynamicId;
    // send request to the backend API to fetch the news item with newsId

    return <h1>Dynamic Path: NewsItem</h1>;
  };
  ```

## Navigation

- Navigation in Next with `Link` Component to preserve SPA feeling
  - prevents browser default of sending GET request to server
  - instead it loads new component (here: 'NextJs') and changes URL \*/}

```TSX
import type { NextPage } from 'next';
import Link from 'next/link';

const Nav: NextPage = () => {
  return <Link href='/news/nextjs'>NextJS</Link>
}
```
