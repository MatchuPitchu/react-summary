# Aria Accessibility in React

## Create an ARIA Log Provider

- Provides access to the ARIA-logs. By adding a message to the log the message can be read by a screen reader: <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/log_role>
- The `log role` is used to identify an element that creates a live region.
- Using JavaScript, it is possible to dynamically change parts of a page without requiring the entire page to reload. `ARIA live regions` rovide a way to programmatically expose dynamic content changes in a way that can be announced by assistive technologies.

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

```SCSS
// 2) Make aria-message-log only available to screen readers
.aria-log {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

```TSX
// 3) Create AriaMessage Component
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
// 4) Example of implementation in Page Component
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

## ARIA Attributes in JSX Elements

- `aria-label` is important, when content of HTML element is not self-explanatory; `aria-label` explicitly tells what the button will do
- `aria-controls` identifies an element whose content is controlled by the current element: here `name` is form field whose value is changed by a button click

```TSX
<button
  className="counter__button"
  type="button"
  onClick={onDecrease}
  aria-label="verringern"
  aria-controls={name}
>
  <Icon name="minus" size={20} />
</button>
```

- define `aria-label` for sections to select easily elements in tests

```TSX
interface Props {
  elternteil: ElternteilType;
  elternteilName: string;
}

export const EinkommenFormElternteil: VFC<Props> = ({
  elternteil,
  elternteilName,
}) => {
  // ...

  return (
    <section aria-label={elternteilName}>
    {/* ... */ }
    </section>
  )
};

// ...spec.tsx
describe("Einkommens Page", () => {
  const getElternteil1Section = () => screen.getByLabelText("Elternteil 1");
  // ...
});
```

### Example of a Form Field Group to wrap one or multiple form fields

- `aria-roledescription` attribute defines a human-readable description for the role of an element

```TSX
import { AriaAttributes, FC } from "react";

interface FormFieldGroupProps extends AriaAttributes {
  headline?: string;
  description?: string;
}

export const FormFieldGroup: FC<FormFieldGroupProps> = ({
  headline,
  description,
  children,
  ...aria
}) => {
  return (
    <section
      aria-label={headline}
      aria-roledescription={description}
      className="form-field-group"
      {...aria}
    >
      {headline && <h3>{headline}</h3>}
      {description && (
        <p className="form-field-group__description">{description}</p>
      )}
      {children}
    </section>
  );
};
```

### Example of a Custom Checkbox

- `aria-invalid` attribute `true`/`false` indicates that input value is invalid
- `aria-describedby` attribute shows where a description is connected to this element

```TSX
import { FieldErrors, FieldValues, Path, UseFormRegister, get, FieldError, RegisterOptions } from "react-hook-form";
import { Description } from "../../atoms";
import classNames from "classnames";

interface Props<TFieldValues extends FieldValues> {
  register: UseFormRegister<TFieldValues>;
  registerOptions?: RegisterOptions<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  errors?: FieldErrors<TFieldValues> | boolean;
}

export const CustomCheckbox = <TFieldValues extends FieldValues>({
  register,
  registerOptions,
  name,
  label,
  errors,
}: Props<TFieldValues>) => {
  let hasError = false;
  let errorMessage = "";
  if (typeof errors === "boolean") {
    hasError = errors;
  } else {
    const error: FieldError | undefined = get(errors, name);
    if (error) {
      hasError = !!error;
      errorMessage = error.message || "";
    }
  }

  return (
    <div className="custom-checkbox">
      <input
        {...register(name, registerOptions)}
        type="checkbox"
        className={classNames("custom-checkbox__input", hasError && "custom-checkbox__input--error")}
        id={name}
        aria-invalid={hasError}
        aria-describedby={errorMessage && `${name}-error`} // connection to id in <Description />
      />
      <label
        className={classNames("custom-checkbox__label", hasError && "custom-checkbox__label--error")}
        htmlFor={name}
      >
        {label}
      </label>
      {errorMessage && (
        <Description id={`${name}-error`} error={true}>
          {errorMessage}
        </Description>
      )}
    </div>
  );
};
```

### Example of a Custom Date

- `aria-hidden` attribute `true`/`false` indicates that element and all childs are NOT visible
- `aria-placeholder` attribute defines a short hint (word, short phrase) intended to help with data entry when a form control has no value

```TSX
import classNames from "classnames";
import {
  FieldPath,
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { IMask, IMaskInput } from "react-imask";
import nsp from "../../../globals/js/namespace";
import { Description } from "../../atoms";

interface CustomDateProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends UseControllerProps<TFieldValues, TName> {
  label: string;
}

export const CustomDate = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  rules,
  name,
  label,
}: CustomDateProps<TFieldValues, TName>) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({ control, rules, name });

  return (
    <div className={nsp("custom-date")}>
      <label className={nsp("custom-date__label")} htmlFor={name}>
        {label}
      </label>
      <div
        className={classNames(
          nsp("custom-date__field"),
          error && nsp("custom-date__field--error"),
        )}
      >
        <span className={nsp("custom-date__placeholder")} aria-hidden={true} /* here hidden since aria-placeholder takes over */>
          TT.MM.JJJJ
        </span>
        <IMaskInput
          className={nsp("custom-date__input")}
          name={name}
          id={name}
          inputRef={ref}
          mask={Date}
          lazy={true}
          autofix={true}
          value={value}
          blocks={{
            d: {
              mask: IMask.MaskedRange,
              placeholderChar: "_",
              from: 1,
              to: 31,
              maxLength: 2,
            },
            m: {
              mask: IMask.MaskedRange,
              placeholderChar: "_",
              from: 1,
              to: 12,
              maxLength: 2,
            },
            Y: {
              mask: IMask.MaskedRange,
              placeholderChar: "_",
              from: 1900,
              to: 2999,
              maxLength: 4,
            },
          }}
          onAccept={(value) => onChange(value as string)}
          onBlur={onBlur}
          placeholder="__.__.___"
          aria-placeholder="Eingabeformat Tag Monat Jahr zum Beispiel 12.05.2022"
          aria-invalid={!!error}
          aria-describedby={error && `${name}-error`}
        />
      </div>
      {error && (
        <Description id={`${name}-error`} error={true}>
          {error.message}
        </Description>
      )}
    </div>
  );
};
```
