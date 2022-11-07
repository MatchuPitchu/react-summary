import { useOrderContext } from '../../store/OrderContext';
import SummaryForm from './SummaryForm';

const OrderSummary = ({ setOrderPhase }) => {
  const { optionCounts, totals } = useOrderContext();

  const scoopArray = Array.from(optionCounts.scoops.entries());
  const scoopList = scoopArray.map(([key, value]) => (
    <li key={key}>
      {value} {key}
    </li>
  ));

  // size prop is available since this is a Map
  const hasToppings = optionCounts.toppings.size > 0;
  let toppingsDisplay = null;

  if (hasToppings) {
    const toppingsArray = Array.from(optionCounts.toppings.keys());
    toppingsDisplay = (
      <>
        <h2>Toppings: {totals.toppings}</h2>
        <ul>
          {toppingsArray.map((key) => (
            <li key={key}>{key}</li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <div>
      <h1>Order Summary</h1>
      <h2>Scoops: {totals.scoops}</h2>
      <ul>{scoopList}</ul>
      {toppingsDisplay}
      <SummaryForm setOrderPhase={setOrderPhase} />
    </div>
  );
};

export default OrderSummary;
