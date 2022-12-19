import type { NextPage } from 'next';
import MainNavigation from './MainNavigation';
import classes from './Layout.module.css';

const Layout: NextPage = (props) => {
  return (
    <div>
      <MainNavigation />
      <main className={classes.main}>{props.children}</main>
    </div>
  );
};

export default Layout;
