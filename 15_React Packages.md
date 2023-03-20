# Useful React Packages

## React Syntax Highlighter

> GitHub Repo: <https://github.com/react-syntax-highlighter/react-syntax-highlighter>

> Demo: <https://react-syntax-highlighter.github.io/react-syntax-highlighter/demo/prism.html>

- React component to highlight programming language syntax
- use `Prism.js` when highlighting `jsx`
- best style: `vscDarkPlus`
- includes a `light build` where you can choose which languages and styles to import

```tsx
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('jsx', jsx);

const Component = () => {
  const codeString = `(num) => num + 1`;
  return (
    <SyntaxHighlighter language='javascript' style={vscDarkPlus}>
      {codeString}
    </SyntaxHighlighter>
  );
};
```

## React Window

> Documentation: <https://react-window.vercel.app/#/api/VariableSizeGrid>

> GitHub Repo: <https://github.com/bvaughn/react-window>

> Demo: <https://codesandbox.io/s/3vnx878jk5>

- React window works by only rendering part of a large data set (just enough to fill the viewport). This helps address some common performance bottlenecks:

  1. It reduces the amount of work (and time) required to render the initial view and to process updates.
  1. It reduces the memory footprint by avoiding over-allocation of DOM nodes.
