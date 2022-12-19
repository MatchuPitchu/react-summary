import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './store/hooks';
// import { uiActions } from './store/ui-slice';
import { sendCartData, fetchCartData } from './store/cart-actions';
import Notification from './components/UI/Notification';
import Layout from './components/Layout/Layout';
import Cart from './components/Cart/Cart';
import Products from './components/Shop/Products';

// 4) Variant with RTK Query: import automatically generated fetch hook
import { useGetCartQuery, useUpdateCartMutation } from './store/cart-api-slice';

const App = () => {
  const dispatch = useAppDispatch();

  // query hook automatically fetches data and returns query values
  const {
    data = { items: [], totalQuantity: 0 },
    error,
    isFetching,
    isLoading,
    isSuccess,
    isError,
  } = useGetCartQuery();

  const [
    updateCart, // mutation trigger fn
    { isLoading: isUpdating }, // destructured mutation result (see in doc)
  ] = useUpdateCartMutation();

  const showCart = useAppSelector((state) => state.ui.isCartVisible);
  const cart = useAppSelector((state) => state.cart);
  const notification = useAppSelector((state) => state.ui.notification);

  // 2) Approach do perform async tasks with Redux:
  // first dispatch actions to update state in redux store,
  // then watch updated state with useEffect and perform async tasks or side-effects
  // useEffect(() => {
  //   if (isInital) {
  //     isInital = false;
  //     return;
  //   }

  //   const sendData = async () => {
  //     dispatch(
  //       uiActions.showNotification({
  //         status: 'pending',
  //         title: 'Sending...',
  //         message: 'Sending cart data',
  //       })
  //     );

  //     const options = {
  //       method: 'PUT', // overwriting existing data
  //       body: JSON.stringify(cart),
  //     };
  //     // firebase test backend: 'cart.json' creates new cart node in database and store data there
  //     const res = await fetch(
  //       'https://react-http-ba0a9-default-rtdb.europe-west1.firebasedatabase.app/cart.json',
  //       options
  //     );

  //     if (!res.ok) throw new Error('Sending data failed.');

  //     dispatch(
  //       uiActions.showNotification({
  //         status: 'success',
  //         title: 'Success',
  //         message: 'Sent cart data successfully',
  //       })
  //     );
  //   };

  //   // async fn returns a Promise: so you can catch all kinds of errors
  //   // that could occur in this fn and dispatch your wished error action
  //   sendData().catch((_) => {
  //     dispatch(
  //       uiActions.showNotification({
  //         status: 'error',
  //         title: 'Error',
  //         message: 'Sending data failed',
  //       })
  //     );
  //   });
  // }, [cart, dispatch]);

  // 3) Approach: use Action Creator Thunk to put logic into Redux Toolkit files
  // for that take code of inside useEffect (look at approach 2) into your state slice file
  // and create there your own action creator thunk that returns another fn;
  // Redux Toolkit accepts as arg for dispatch() also action creators that returns another fn;
  // Toolkit notices that and will execute that returned fn for you
  useEffect(() => {
    // only if data was changed locally, send HTTP request
    if (cart.changedLocally) dispatch(sendCartData(cart));
  }, [cart, dispatch]);

  // 4) Approach: RTK Query
  useEffect(() => {
    // only if data was changed locally, send HTTP request
    if (cart.changedLocally) updateCart(cart);
  }, [cart, updateCart]);

  // fetch cart data from backend when app is mounted
  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  return (
    <>
      {/* Variant with RTK Query */}
      {data.items && (
        <div>
          <p>Number of Cart items fetched: {data.items.length}</p>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Quanity</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </>
  );
};

export default App;
