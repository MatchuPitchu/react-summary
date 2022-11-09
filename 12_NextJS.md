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

### Preparing Paths with getStaticPaths and Working with Fallback Pages

- `getStaticPath` is needed if you are using `getStaticProps` in a dynamic page
- `fallback` property in returned object tells Next.js if paths array contains all supported parameter values OR only some of them
  - handy to pre-generate only some important pages, BUT not all possible pages
  - `false`: if user enters anything that's NOT supported in paths array, 404 page would be shown
  - `true`: Next.js immediately pre-generates empty page for user param input that's NOT contained in paths array AND then pull down the dynamically generated content -> you need to handle case that page does NOT have data yet
  - `blocking`: Next.js will wait for the dynamically generated HTML for new paths that are NOT contained in paths array AND then will cache this for future requests -> so it only happens once per path.

```TSX
// my-domain.de/:meetupId (-> param name is derived of folder name in Next.js: [meetupId] )
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import MeetupDetail from '../../components/meetups/MeetupDetail';

interface Props {
  id: string;
  image: string;
  alt: string;
  title: string;
  address: string;
  description: string;
}

const Meetup: NextPage<Props> = ({ id, image, alt, title, address, description }) => {
  console.log(`Client-side: ${id}`);

  return <MeetupDetail image={image} alt={alt} title={title} address={address} description={description} />;
};

export const getStaticPaths: GetStaticPaths = () => {
  // hard coded paths
  const paths = [
    {
      params: {
        meetupId: 'm1',
      },
    },
    {
      params: {
        meetupId: 'm2',
      },
    },
  ];

  return {
    // define ALL supported parameters in URL
    paths,
    fallback: 'blocking',
  };
};

// Next.js pre-generates ALL versions of dynamic page for ALL supported ids
export const getStaticProps: GetStaticProps = async (context) => {
  // it's a dynamic page, so you need to get identifier
  const meetupId = context.params?.meetupId; // get parameter in URL (-> here [meetupId] -> look at pages folder)
  console.log(`Server-side: ${meetupId}`); // is logged in console (NOT browser), because run's at build time

  // fetch data for a single meetup
  // Notice: look into Next.js example project for MongoDB implementation
  // ...

  return {
    props: {
      id: meetupId,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1024px-Stadtbild_M%C3%BCnchen.jpg',
      alt: 'First Meetup',
      title: 'First Meetup',
      address: 'Somme address 5, 12345 City',
      description: 'Somme description',
    },
  };
};

export default Meetup;
```

## API Routes - Backend inside your App

- create folder `api` inside `pages` folder
- all files inside this folder will be turned into API routes (-> endpoints that can be targeted by requests)
- file names will be `path segments` in the URL

```TypeScript
// utils function to connect to database
// install mongodb driver: npm i mongodb + create a mongodb cluster https://cloud.mongodb.com
import { MongoClient } from 'mongodb'; // Next.js detects this and will NOT bundle it into client side build

export const connectDatabase = async () => {
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.2gcet26.mongodb.net/nextjs-example-database?retryWrites=true&w=majority`
  );
  const db = client.db();
  const meetupsCollection = db.collection('meetups'); // name of your choice for collection inside your database

  return { meetupsCollection, client };
};
```

```TypeScript
// API route: /api/add-meetup
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDatabase } from '../../utils/mongodb-connection';

// code will NEVER be exposed on client side -> it's normal server side NodeJS code
// name function as you want
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // only POST requests allowed to /api/add-meetup
  if (req.method !== 'POST') return;

  const { title, image, address, description } = req.body;
  const { meetupsCollection, client } = await connectDatabase();

  try {
    const result = await meetupsCollection.insertOne({ title, image, address, description });
    console.log(result);
    res.status(201).json({ message: 'Meetup inserted' }); // API request succeeded with custom message
  } catch (error) {
    console.log(error);
    res.status(400).json(error); // API request failed with custom message
  }
  client.close(); // close database connection
};

export default handler;
```

```TSX
// Example: POST request
// my-domain.de/new-meetup
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { MeetupData } from '../../components/meetups/NewMeetupForm';
import NewMeetupForm from '../../components/meetups/NewMeetupForm';

const NewMeetup: NextPage = () => {
  const router = useRouter();

  const addMeetupHandler = async (enteredMeetupData: MeetupData) => {
    // fetch from internal Next.js API in api folder with specific filename (-> here 'add-meetup')
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify(enteredMeetupData),
        headers: { 'Content-Type': 'application/json' },
      };
      const response = await fetch(`/api/add-meetup`, options);
      const data = await response.json();
      console.log(data);

      router.replace('/'); // go to starting page after successful POST request
    } catch (error) {
      console.error(error);
    }
  };

  return <NewMeetupForm onAddMeetup={addMeetupHandler} />;
};

export default NewMeetup;
```

```TSX
// Example: GET request
import type { GetStaticProps, NextPage } from 'next';
import MeetupList from '../components/meetups/MeetupList';
import { connectDatabase } from '../utils/mongodb-connection';

const Home: NextPage<Props> = ({ meetups }) => {
  return <MeetupList meetups={meetups} />;
};

export const getStaticProps: GetStaticProps = async () => {
  // fetch data from an API or database (in Next.js you can use fetch() in server-side code)
  // ...
  // NOTICE: if you are fetching data from own Next.js API routes,
  // you do NOT need fetch(), you can directly get data from database
  const { meetupsCollection, client } = await connectDatabase();
  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 3600,
  };
};

export default Home;
```

## Adding Head Metadata to Pages

- use `<Head>` component that can be imported from `next/head`
- hard code oder dynamically generate your head content

```TSX
const Meetup: NextPage<Props> = ({ _id, image, alt, title, address, description }) => {
  return (
    <>
      <Head>
        <title>Dynamic HTML Title {title}</title>
        <meta name='description' content={description} />
        {/* ... */}
      </Head>
      <MeetupDetail image={image} alt={alt} title={title} address={address} description={description} />
    </>
  );
};
```

## Deployment of Next.js App

- Hosting Provider `Vercel` is optimized for Next.js -> `Vercel` deploys automatically for you
- normal build steps: execute scripts `npm run build` (create production ready `.next` folder) -> `npm start` (start production server)
