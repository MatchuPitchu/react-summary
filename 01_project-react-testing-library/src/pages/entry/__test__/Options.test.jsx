import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../__test-utils__/testing-library-utils';
import Options from '../Options';

describe('Options component', () => {
  test('displays image for each scoop option from server', async () => {
    // GET request happens in Options component
    // with configuration in setupTest.js, handlers.js and server.js
    // test runs component and mock service worker is going to intercept to the request
    // and sends back handler response
    render(<Options optionType='scoops' />);

    // find images with 'scoop' at the end of alt text
    const scoopImages = await screen.findAllByRole('img', { name: /scoop$/i });
    expect(scoopImages).toHaveLength(3);

    // confirm alt text of images (create array of alt texts)
    const altText = scoopImages.map((img) => img.alt);
    // arrays + objects use toEqual() while nums + string use toBe()
    expect(altText).toEqual(['Chocolate scoop', 'Vanilla scoop', 'Salted caramel scoop']);
  });

  test('displays image for each topping from server', async () => {
    render(<Options optionType='toppings' />);

    const toppingImages = await screen.findAllByRole('img', { name: /topping$/i });
    expect(toppingImages).toHaveLength(3);

    const altText = toppingImages.map((img) => img.alt);
    expect(altText).toEqual(['Cherries topping', 'M&Ms topping', 'Hot fudge topping']);
  });

  test('do not update total if scoops input is invalid', async () => {
    render(<Options optionType='scoops' />);

    // expect btn to be disabled after adding scoop
    const vanillaInput = await screen.findByRole('spinbutton', { name: /vanilla/i });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, '-1');

    // make sure scoops subtotal hasn't updated
    const scoopsSubtotal = screen.getByText(/^scoops total:.+€$/i);
    expect(scoopsSubtotal).toBeInTheDocument();
  });
});
