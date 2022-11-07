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
  - Recommended Approach: pages components remain lean, normal reusable components builds these pages

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

## Page Pre-Rendering

- `Request` -> `/some-route` -> return pre-rendered page (good for SEO) -> then hydrate with React code once loaded (that means pre-rendered page is handed over to React and act now like a SPA)
- then `Page/App` is interactive and `useEffect` code with e.g. data fetching from server will be executed
- `Problem`: this data is not visible in pre-rendered page

```TSX
const Home = () => {
  // V1: WITHOUT Pre-rendering: normal process to fetch additional data from server
  const [loadedMeetups, setLoadedMeetups] = useState<typeof DUMMY_MEETUPS>([]);

  useEffect(() => {
    // normally: send HTTP Request and fetch data (here only simulated)
    // problem: useEffect with data fetching is executed after component fn is executed,
    // so first loadedMeetups is empty [], this causes problem with SEO
    setLoadedMeetups(DUMMY_MEETUPS);
  }, []);

  return <MeetupList meetups={loadedMeetups} />;
};
```

- `Solution`: 2 Forms of Pre-Rendering

  - `Static Site Generation (SSG)`:
    - it's faster than `getServerSideProps`
    - page component is pre-rendered during `build process` for production (-> `npm run build`)
    - if you need to fetch also additional data from server, use `getStaticProps()` to prepare props for a certain page
    - `getStaticProps()` works only in `pages folder`; it allows to execute code that normally only runs on server-side (e.g. access file system, securely connect to database)
    - if Next finds this fn, it will execute it during pre-rendering process, i.e. BEFORE execution of component fn -> code will `NEVER reach client-side` since it's executed during build process
    - use fn with `async` and Next waits until Promise is resolved (-> until data is loaded) and returns props for component fn
    - when your fetched data will change regulary, add `revalidate` property to return object
      - unlocks feature `Incremental Static Generation`
      - example: this page would be re-generated on server at least every x seconds if there are requests coming in -> re-generated pages replace old pages -> so data is never older than x seconds

  ```TSX
  const Home: NextPage<Props> = ({ meetups }) => {
    return <MeetupList meetups={meetups} />;
  };

  export const getStaticProps: GetStaticProps = async () => {
    // fetch data from an API or database
    // ...

    // need to return object with props property (-> object that is passed into your component)
    return {
      props: {
        meetups: DUMMY_MEETUPS,
      },
      revalidate: 3600,
    };
  };
  ```

  - `Server-side Rendering (SSR)`
    - only use it if you need access to request and response object OR if your data changes really very often
    - page is re-rendered on every incoming request
    - `getServerSideProps` runs NOT during build, but always on server after deployment
    - code NEVER runs on client side (like `getStaticProps`)

  ```TSX
  const Home: NextPage<Props> = ({ meetups }) => {
    return <MeetupList meetups={meetups} />;
  };

  export const getServerSideProps: GetServerSideProps = async (context) => {
    // access to request and response object
    const req = context.req;
    const res = context.res;

    // fetch data from an API or database
    // ...

    return {
      props: {
        meetups: DUMMY_MEETUPS,
      },
    };
  };
  ```
