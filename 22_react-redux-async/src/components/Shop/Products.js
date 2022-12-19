import ProductItem from './ProductItem';
import classes from './Products.module.css';

const DUMMY_PRODUCTS = [
  { id: 'p1', price: 6, title: 'First Book', description: 'The First Book I ever wrote' },
  { id: 'p2', price: 6, title: 'Second Book', description: 'The Second Book I ever wrote' },
];

const Products = (props) => {
  return (
    <section className={classes.products}>
      <h2>Buy your favorite products</h2>
      <ul>
        {DUMMY_PRODUCTS.map(({ id, price, title, description }) => (
          <ProductItem key={id} id={id} title={title} price={price} description={description} />
        ))}
      </ul>
    </section>
  );
};

export default Products;
