# Aria Accessibility in React

## Create an ARIA Log Provider

- Provides access to the ARIA-logs. By adding a message to the log the message can be read by a screen reader: <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/log_role>

```TSX
// 1) Create Context: AriaLogProvider.tsx
import { createContext, FC, useCallback, useContext, useState } from "react";

type RemoveMessageFn = () => void;

interface IAriaLogContext {
  addMessage: (message: string) => RemoveMessageFn;
}

const AriaLogContext = createContext<IAriaLogContext | undefined>(undefined);

export const AriaLogProvider: FC = ({ children }) => {
  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = useCallback((message: string) => {
    setMessages((existing) => [message, ...existing]);

    return () =>
      setMessages((existing) =>
        existing.filter((otherMessage) => otherMessage !== message),
      );
  }, []);

  return (
    <AriaLogContext.Provider value={{ addMessage }}>
      <div role="log" className="aria-log">
        {messages.map((message) => (
          <p key={message}>{message}</p>
        ))}
      </div>

      {children}
    </AriaLogContext.Provider>
  );
};

export const useAriaLog = () => {
  const context = useContext(AriaLogContext);

  if (!context) {
    throw new Error("Missing context for 'useAriaLog' hook.");
  }

  return context;
};
```

```TSX
// 2) Create AriaMessage Component
import { useEffect, VFC } from "react";
import { useAriaLog } from "./AriaLogProvider";

interface AriaMessageProps {
  children: string;
}

export const AriaMessage: VFC<AriaMessageProps> = ({ children: message }) => {
  const { addMessage } = useAriaLog();

  // message is automatically removed with remove function that is returned from addMessage()
  useEffect(() => addMessage(message), [addMessage, message]);

  return null;
};
```

```TSX
// 3) Example for implementation in Page Component
import { FC } from "react";
import { AriaMessage } from "../../atoms";
import { Page } from "../../../utils/pages";
import { Sidebar } from "../../organisms/sidebar";

interface PageProps {
  page: Page;
}

export const Page: FC<PageProps> = ({ page, children }) => {
  return (
    <div className="page">
      <div className="page__sidebar">
        <Sidebar currentPage={page} />
      </div>
      <h2 className="page__title">Elterngeldrechner mit Planer</h2>
      <AriaMessage>{page.text}</AriaMessage>
      <div className="page__content">{children}</div>
    </div>
  );
};

export interface Page {
  text: string;
  route: string;
}

export type Pages = Record<string, Page>;

export const pages: Pages = {
  home: {
    text: "Home",
    route: "/",
  },
  // ...
}

const Home = () => {
  // ...

  return (
    <Page page={pages.home}>
      {/* ... */}
    </Page>
  );
}
```
