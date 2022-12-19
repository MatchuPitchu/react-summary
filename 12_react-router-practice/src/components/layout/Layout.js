import classes from './Layout.module.css';
import MainNavigation from './MainNavigation';

const Layout = ({ children }) => {
  return (
    <>
      <MainNavigation />
      <main className={classes.main}>{children}</main>
    </>
  );
};

export default Layout;
