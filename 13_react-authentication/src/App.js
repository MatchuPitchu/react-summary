import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import UserProfile from './components/Profile/UserProfile';

const App = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Layout>
      <Routes>
        <Route path='/' element={<HomePage />} />
        {/* protecting routes conditionally */}
        {!isLoggedIn && <Route path='/auth' element={<AuthPage />} />}
        <Route
          path='/profile'
          element={isLoggedIn ? <UserProfile /> : <Navigate replace to='/' />}
        />
        {/* redirect user on starting page if he types in not existing path */}
        <Route path='*' element={<Navigate replace to='/' />} />
      </Routes>
    </Layout>
  );
};

export default App;
