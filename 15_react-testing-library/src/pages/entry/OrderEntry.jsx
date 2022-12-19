import { useOrderContext } from '../../store/OrderContext';
import { Button } from 'react-bootstrap';
import { formatCurrency } from '../../utilities/index';
import Options from './Options';

const OrderEntry = ({ setOrderPhase }) => {
  const { totals } = useOrderContext();

  // have to use formatCurrency fn for comparison
  const orderDisbaled = totals.scoops === formatCurrency(0);

  return (
    <div>
      <h1>Design Your Sundae</h1>
      <Options optionType='scoops' />
      <Options optionType='toppings' />
      <h2>Grand total: {totals.grandTotal}</h2>
      <Button disabled={orderDisbaled} onClick={() => setOrderPhase('review')}>
        Order Sundae
      </Button>
    </div>
  );
};

export default OrderEntry;
