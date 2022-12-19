import { useSelector } from 'react-redux';
import Header from './components/Header';
import Auth from './components/Auth';
import Counter from './components/Counter';
import UserProfile from './components/UserProfile';

const App = () => {
  const isAuth = useSelector((state) => state.auth.isAuth);

  return (
    <>
      <Header />
      {!isAuth && <Auth />}
      {isAuth && UserProfile}
      <Counter />;
    </>
  );
};

export default App;
