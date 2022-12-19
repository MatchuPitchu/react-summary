import { useEffect, useState } from 'react';
import { useOrderContext } from '../../store/OrderContext';
import { Button } from 'react-bootstrap';
import AlertBanner from '../components/AlertBanner';

const OrderConfirmation = ({ setOrderPhase }) => {
  const { resetOrder } = useOrderContext();
  const [error, setError] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  useEffect(() => {
    const sending = async () => {
      try {
        // not working, did not implement real server
        // const options = {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(SOME_DATA), // body data type must match "Content-Type" header
        // };
        // const response = await fetch(`http://localhost:3030/order`, { options });
        // const { orderNumber } = await response.json();
        // setOrderNumber(orderNumber);
        setOrderNumber('1234');
      } catch (error) {
        console.log(error);
        setError(true);
      }
    };
    sending();
  }, []);

  const handleClick = () => {
    resetOrder();
    setOrderPhase('inProgress');
  };

  if (error) return <AlertBanner />;

  if (!orderNumber) return <div>Loading...</div>;

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Thank you</h1>
      <p>Your order number is {orderNumber}</p>
      <p style={{ fontSize: '75%' }}>as per our terms and conditions, nothing will happen now</p>
      <Button onClick={handleClick}>Create new order</Button>
    </div>
  );
};

export default OrderConfirmation;
