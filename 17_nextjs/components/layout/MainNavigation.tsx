import type { NextPage } from 'next';
import Link from 'next/link';
import classes from './MainNavigation.module.css';

const MainNavigation: NextPage = () => {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>React Meetups</div>
      <nav>
        <ul>
          <li>
            <Link href='/'>All Meetups</Link>
          </li>
          <li>
            <Link href='/add-meetup'>Add New Meetup</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
