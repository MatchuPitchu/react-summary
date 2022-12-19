import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

import Card from '../UI/Card/Card';
import Button from '../UI/Button/Button';
import classes from './Home.module.css';

const Home = () => {
  const { logoutHandler } = useContext(AuthContext);

  return (
    <Card className={classes.home}>
      <h1>Welcome back!</h1>
      <Button onClick={logoutHandler}>Logout</Button>
    </Card>
  );
};

export default Home;
