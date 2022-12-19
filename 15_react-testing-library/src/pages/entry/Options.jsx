import { useState, useEffect } from 'react';
import { useOrderContext } from '../../store/OrderContext';
import { pricePerItem } from '../../constants/index';
import { formatCurrency } from '../../utilities/index';
import Row from 'react-bootstrap/Row';
import ScoopOption from './ScoopOption';
import ToppingOption from './ToppingOption';
import AlertBanner from '../components/AlertBanner';

import chocolate from '../../images/chocolate.png';
import vanilla from '../../images/vanilla.png';
import saltedCaramel from '../../images/salted-caramel.png';
import cherries from '../../images/cherries.png';
import mAndMs from '../../images/m-and-ms.png';
import hotFudge from '../../images/hot-fudge.png';

// optionType is 'scoops' or 'toppings'
const Options = ({ optionType }) => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);
  const { totals, updateItemCount } = useOrderContext();

  useEffect(() => {
    const fetching = async () => {
      try {
        // not working, did not implement real server
        // const response = await fetch(`http://localhost:3030/${optionType}`);
        // const data = await response.json();
        // setItems(data)
        if (optionType === 'scoops')
          setItems([
            { name: 'Chocolate', imagePath: chocolate },
            { name: 'Vanilla', imagePath: vanilla },
            { name: 'Salted caramel', imagePath: saltedCaramel },
          ]);
        if (optionType === 'toppings')
          setItems([
            { name: 'Cherries', imagePath: cherries },
            { name: 'M&Ms', imagePath: mAndMs },
            { name: 'Hot fudge', imagePath: hotFudge },
          ]);
      } catch (error) {
        console.log(error);
        setError(true);
      }
    };
    fetching();
  }, [optionType]);

  if (error) return <AlertBanner />;

  const ItemComponent = optionType === 'scoops' ? ScoopOption : ToppingOption;
  const title = optionType[0].toUpperCase() + optionType.slice(1).toLowerCase();

  const optionItems = items.map(({ name, imagePath }) => {
    return (
      <ItemComponent
        key={name}
        name={name}
        imagePath={imagePath}
        updateItemCount={(itemName, newItemCount) =>
          updateItemCount(itemName, newItemCount, optionType)
        }
      />
    );
  });

  return (
    <>
      <h2>{title}</h2>
      <p>{formatCurrency(pricePerItem[optionType])} each</p>
      <p>
        {title} total: {totals[optionType]}
      </p>
      <Row>{optionItems}</Row>
    </>
  );
};

export default Options;
