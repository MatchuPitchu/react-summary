import type { NextPage } from 'next';
import MeetupItem from './MeetupItem';
import classes from './MeetupList.module.css';

type Meetup = {
  id: string;
  image: string;
  title: string;
  address: string;
};

interface Props {
  meetups: Meetup[];
}

const MeetupList: NextPage<Props> = ({ meetups }) => {
  return (
    <ul className={classes.list}>
      {meetups.map((meetup) => (
        <MeetupItem key={meetup.id} id={meetup.id} image={meetup.image} title={meetup.title} address={meetup.address} />
      ))}
    </ul>
  );
};

export default MeetupList;
