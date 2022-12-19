import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  // built-in hook allows catching of dynamic param in URL path;
  // hook returns obj with key(s) of all dynamic placeholders used in URL path (can use multiple)
  const { productId } = useParams();

  return (
    <section>
      <h1>Product Detail</h1>
      <p>Output Parm in URL path: {productId}</p>
    </section>
  );
};

export default ProductDetail;
