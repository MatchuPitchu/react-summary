import { Route } from 'react-router-dom';

const Welcome = () => {
  return (
    <section>
      <h1>The Welcome Page</h1>
      {/* nested routes:
      can use Routes wherever I want -> here if Welcome page is active, Route below is evaluated;
      in /welcome path only a nested path like '/welcome/hello' would work to display a wished component */}
      <Route path='/welcome/hello'>
        <p>Welcome in the nested route</p>
      </Route>
    </section>
  );
};

export default Welcome;
