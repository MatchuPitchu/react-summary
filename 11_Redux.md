# Redux - Managing App-Wide State

## What is Redux?

- state management system for cross-componment or app-wide state (like `React Context`)
- `local state`: belongs to a single component (-> should be managed internal of component wie `useState` or `useReducer` hooks)
- `cross-component state`: affects multiple components (-> requires `prop chains`/`prop drilling` OR `Context` or `Redux`)
- `app-wide state`: affects entire app (most or all components) (-> requires `prop chains`/`prop drilling` OR `Context` or `Redux`)

## Redux vs React Context

- in more complex apps, managing `Context` can lead to deeply nested JSX code or huge `Context Provider` components

  ```JSX
  // 1) if you want to separate concerns, then you could have deeply nested context components
  return (
    <AuthContextProvider>
      <ThemeContextProvider>
        <UIInteractionContextProvider>
          <MultiStepFormContextProvider>
            <UserRegistration />
          </MultiStepFormContextProvider>
        </UIInteractionContextProvider>
      </ThemeContextProvider>
    </AuthContextProvider>
  )
  ```

  ```JavaScript
  // 2) if you collect all different concerns in one file, becomes difficult to manage and maintain
  const AllContextProvider = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [isEvaluatingAuth, setIsEvaluatingAuth] = useState(false);
    const [activeTheme, setActiveTheme] = useState('default');
    // ...

    const loginHandler = (email, password) => { ... };
    const signupHandler = (email, password) => { ... };
    const changeThemeHandler = (newTheme) => { ... };
    // ...

    return <AllContext.Provider></AllContext.Provider>
  }
  ```

- performance: `Context` is not optimized for high-frequency state changes

## Core Redux Concepts

- one `Central Data (State) Store` (never more than one) for entire app
- components set up `Subscriptions` to store and whenever data changes, store notifies components and they get the needed slice of data
- components NEVER manipulate directly the store data
- `Reducer Function` is responsible for mutating store data
  - components dispatch or trigger `Actions` (-> is an object which describes the kind of operation the reducer should perform)
  - `Action` is forwarded to Reducer Fn
