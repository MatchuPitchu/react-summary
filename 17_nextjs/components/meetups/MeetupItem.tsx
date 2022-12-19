import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Card from '../ui/Card';
import classes from './MeetupItem.module.css';

interface Props {
  id: string;
  image: string;
  title: string;
  address: string;
}

const MeetupItem: NextPage<Props> = (props) => {
  const router = useRouter();

  const showDetailsHandler = () => {
    // navigate programmatically (instead of using a Link that would be also possible in this component)
    router.push(`/${props.id}`);
  };

  return (
    <li className={classes.item}>
      <Card>
        <div className={classes.image}>
          <img src={props.image} alt={props.title} />
        </div>
        <div className={classes.content}>
          <h3>{props.title}</h3>
          <address>{props.address}</address>
        </div>
        <div className={classes.actions}>
          <button onClick={showDetailsHandler}>Show Details</button>
        </div>
      </Card>
    </li>
  );
};

export default MeetupItem;
