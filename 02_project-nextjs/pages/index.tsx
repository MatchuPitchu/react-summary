// my-domain.de
import { useState, useEffect } from 'react';
import type { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import MeetupList from '../components/meetups/MeetupList';
import { connectDatabase } from '../utils/mongodb-connection';

interface Props {
  meetups: {
    id: string;
    title: string;
    image: string;
    address: string;
    description: string;
  }[];
}

const DUMMY_MEETUPS = [
  {
    id: 'm1',
    title: 'First Meetup',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1024px-Stadtbild_M%C3%BCnchen.jpg',
    address: 'Somme address 5, 12345 City',
    description: 'This is a first meetup.',
  },
  {
    id: 'm2',
    title: 'Second Meetup',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Skyline_von_der_Siegess%C3%A4ule_aus.jpg',
    address: 'Somme address 10, 12345 City',
    description: 'This is a second meetup.',
  },
];

// Recommended Approach: pages remains lean, normal reusable components builds these pages
// const Home: NextPage = () => {
//   // V1: WITHOUT Pre-rendering: normal process to fetch additional data from server
//   const [loadedMeetups, setLoadedMeetups] = useState<typeof DUMMY_MEETUPS>([]);

//   useEffect(() => {
//     // normally: send HTTP Request and fetch data (here only simulated)
//     // problem: useEffect with data fetching is executed after component fn is executed,
//     // so first loadedMeetups is empty [], this causes problem with SEO
//     setLoadedMeetups(DUMMY_MEETUPS);
//   }, []);

//   return <MeetupList meetups={loadedMeetups} />;
// };

// V2: WITH Pre-rendering with Static Site Generation (SSG):
// it's faster than `getServerSideProps`
// if you need to fetch also additional data from server,
// use getStaticProps() to prepare props for a certain page;
// fn only works in pages folder and fn allows to execute code that normally only runs on server side (-> access file system, securely connect to database, credentials);
// code will NEVER reach client side since it's executed during build process;
// if Next finds this fn, it will execute it during pre-rendering process, i.e. BEFORE execution of component fn;
// use it with async and Next waits until Promise is resolved (-> until data is loaded) and return props for component fn
const Home: NextPage<Props> = ({ meetups }) => {
  return (
    <>
      <Head>
        {/* add metadata for head of HTML page with Head Component */}
        <title>HTML Page Title</title>
        <meta name='description' content='Lorem ipsum' />
      </Head>
      <MeetupList meetups={meetups} />;
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // fetch data from an API or database (in Next.js you can use fetch() in server-side code)
  // ...
  // NOTICE: if you are fetching data from own Next.js API routes,
  // you do NOT need fetch(), you can directly get data from database
  const { meetupsCollection, client } = await connectDatabase();

  const meetups = await meetupsCollection.find().toArray();
  client.close();

  // need to return object with props property (-> object that is passed into your component)
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        id: meetup._id.toString(), // have to convert MongoDB ObjectId into string
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
      })), // database data instead of hard coded 'DUMMY_MEETUPS'
    },
    // when your fetched data is changing regulary, add `revalidate` property
    // that unlocks feature Incremental Static Generation
    // example: this page would be re-generated on server at least every x seconds if there are requests coming in
    // re-generated pages replace old pages
    revalidate: 3600, // -> 1h = 3600; data is never older than 1h
  };
};

export default Home;

// V3: WITH Pre-rendering with Server-side Rendering (SSR)
// only use it if you need access to request and response object OR if your data changes really very often
// page is re-rendered on every incoming request
// getServerSideProps runs NOT during build, but always on server after deployment
// code NEVER runs on client side (like getStaticProps)
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   // access to request and response object
//   const req = context.req;
//   const res = context.res;

//   // fetch data from an API or database
//   // ...

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// };
