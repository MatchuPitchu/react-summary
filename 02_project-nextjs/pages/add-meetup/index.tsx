// my-domain.de/new-meetup
import { NextPage } from 'next';
import Head from 'next/head';
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

  return (
    <>
      <Head>
        <title>HTML Page Title</title>
        <meta name='description' content='Lorem ipsum' />
      </Head>
      <NewMeetupForm onAddMeetup={addMeetupHandler} />;
    </>
  );
};

export default NewMeetup;
