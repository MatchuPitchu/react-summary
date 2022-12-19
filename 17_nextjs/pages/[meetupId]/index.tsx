// my-domain.de/:meetupId
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { ObjectId, WithId, Document } from 'mongodb';
import MeetupDetail from '../../components/meetups/MeetupDetail';
import { connectDatabase } from '../../utils/mongodb-connection';

interface Props {
  _id: string;
  image: string;
  alt: string;
  title: string;
  address: string;
  description: string;
}

const Meetup: NextPage<Props> = ({ _id, image, alt, title, address, description }) => {
  console.log(`Client-side: ${_id}`);

  return (
    <>
      <Head>
        {/* add metadata for head of HTML page with Head Component */}
        <title>Dynamic HTML Title {title}</title>
        <meta name='description' content={description} />
      </Head>
      <MeetupDetail image={image} alt={alt} title={title} address={address} description={description} />
    </>
  );
};

// getStaticPath is needed if you are using getStaticProps in a dynamic page
export const getStaticPaths: GetStaticPaths = async () => {
  const { meetupsCollection, client } = await connectDatabase();

  const ids = await meetupsCollection.distinct('_id', {});
  client.close();

  // dynamically generated paths
  const paths = ids.map((id) => ({
    params: { meetupId: id.toString() },
  }));

  // hard coded paths
  // const paths = [
  //   {
  //     params: {
  //       meetupId: 'm1',
  //     },
  //   },
  //   {
  //     params: {
  //       meetupId: 'm2',
  //     },
  //   },
  // ];

  return {
    // define ALL supported parameters in URL
    paths,
    // tells Next.js if paths array contains all supported parameter values OR only some of them
    // handy to pre-generate only some important pages, BUT not all possible pages
    // false: if user enters anything that's NOT supported in paths array, 404 page would be shown
    // true: Next.js immediately pre-generates empty page for user param input that's NOT contained
    // in paths array AND then pull down the dynamically generated content -> you need to handle case that page does NOT have data yet
    // 'blocking': Next.js will wait for the dynamically generated HTML for new paths that are NOT contained in paths array
    // AND then will cache this for future requests -> so it only happens once per path.
    fallback: 'blocking',
  };
};

// Next.js pre-generates ALL versions of dynamic page for ALL supported ids
export const getStaticProps: GetStaticProps = async (context) => {
  // it's a dynamic page, so you need to get identifier
  // get parameter in URL (-> here [meetupId] -> look at pages folder)
  // ObjectId -> MongoDB specific
  const meetupId = new ObjectId(context.params?.meetupId?.toString());
  console.log(`Server-side: ${meetupId}`); // is logged in console (NOT browser), because run's at build time

  // fetch data for a single meetup
  // ...
  const { meetupsCollection, client } = await connectDatabase();
  const selectedMeetup = await meetupsCollection.findOne({ _id: meetupId });

  client.close();

  // JSON.parse(JSON.stringify()) is MongoDB specific because of return of ObjectId('...') as '_id'
  return {
    props: JSON.parse(JSON.stringify(selectedMeetup)),
  };
};

export default Meetup;
