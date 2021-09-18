# React

> https://reactjs.org/

> Academind GitHub Repo of the course: https://github.com/academind/react-complete-guide-code/tree/master

- client-side JS library four building reactive user interfaces
- Traditionally, in web apps, you click a link and wait for a new page to load. You click a button and wait for some action to complete. In React, you don't wait for new pages to load or actions to start
- with JS you can manipulate HTML structure (DOM) of a page -> that allows to change what user sees without sending a request to the server and waiting for new fetched HTML page

## Vanilla JavaScript vs ReactJS

- with Vanilla JS I have to decribe every single step of a functionality (-> called imperative approach) which reaches its limits at some point AND developer has to take care of all details and has to do repetitive tasks

  ```JavaScript
    const modalCancelAction = document.createElement('button');
    modalCancelAction.textContent = 'Cancel';
    modalCancelAction.className = 'btn btn--alt';
    modalCancelAction.addEventListener('click', closeModalHandler);
  ```

- in React basic steps are done by the library; the developer describes rather on a higher level the end result of what should be displayed on the screen (-> called declarative approach); in React the code of one application is splitted in multiple small components that are responsible for one clear task; so code stays maintainable and manageable; React library is doing the rendering and combining of the code

## Building Single-Page Applications (SPAs) with React

1. React can be used to control parts of HTML pages or entire pages (e.g. a sidebar) called widget approcach on a multi-page-app
2. React can also be used to control the entire frontend of a web app called SPA approach (-> server only sends one HTML page, React takes over and controls UI)
