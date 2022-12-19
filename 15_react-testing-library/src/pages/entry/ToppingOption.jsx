import { Col, Form } from 'react-bootstrap';

const ToppingOption = ({ name, imagePath, updateItemCount }) => {
  return (
    <Col xs={12} sm={6} md={4} lg={3} style={{ textAlign: 'center' }}>
      <img style={{ width: '75%' }} src={imagePath} alt={`${name} topping`} />
      <Form.Group controlId={`${name}-topping-checkbox`}>
        <Form.Check
          type='checkbox'
          onChange={({ target }) => updateItemCount(name, target.checked ? 1 : 0)}
          label={name}
        />
      </Form.Group>
    </Col>
  );
};

export default ToppingOption;
