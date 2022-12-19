import { useState } from 'react';
import { Col, Row, Form } from 'react-bootstrap';

const ScoopOption = ({ name, imagePath, updateItemCount }) => {
  const [isValid, setIsValid] = useState(true);

  const handleChange = ({ target }) => {
    // make sure to use a number for validation (num from 0 to 10 and an integer)
    const num = +target.value;
    // if one condition is false then everything is false
    const valueIsValid = 0 <= num && num <= 10 && Math.floor(num) === num;
    setIsValid(valueIsValid);

    if (valueIsValid) updateItemCount(name, target.value);
  };

  return (
    <Col xs={12} sm={6} md={4} lg={3} style={{ textAlign: 'center' }}>
      <img style={{ width: '75%' }} src={imagePath} alt={`${name} scoop`} />
      <Form.Group controlId={`${name}-count`} as={Row} style={{ marginTop: '10px' }}>
        <Form.Label column xs='6' style={{ textAlign: 'right' }}>
          {name}
        </Form.Label>
        <Col xs='5' style={{ textAlign: 'left' }}>
          <Form.Control
            type='number'
            defaultValue={0}
            onChange={handleChange}
            isInvalid={!isValid}
          />
        </Col>
      </Form.Group>
    </Col>
  );
};

export default ScoopOption;
