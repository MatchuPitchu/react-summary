import { Heading, Paragraph } from './typography-components';

// Article Design System Components: https://www.lloydatkinson.net/posts/2022/design-system-component-as-is-props/

const App = () => {
  return (
    <div className='App'>
      <Heading level={1}>Heading h1</Heading>
      <Paragraph size='large'>This is a large paragraph.</Paragraph>
      <Heading level={3}>Heading h3</Heading>
      <Paragraph size='small'>This is a small paragraph.</Paragraph>
    </div>
  );
};

export default App;
