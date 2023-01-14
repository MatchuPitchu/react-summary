# Project Capstone

> Udemy Course: <https://www.udemy.com/course/complete-react-developer-zero-to-mastery>

> GitHub Repo: <https://github.com/ZhangMYihua/crwn-clothing-v2>

> Firebase Project: <https://console.firebase.google.com/project/course-react-capstone>

## NPM Packages

- `firebase` for `authentication` and `firestore database`: <https://www.npmjs.com/package/firebase>

  - firestore db:
    - `data`: a value
    - `document`: a JSON object of data (and nested data) representing one entity
    - `collection`: a collection of entities
  - firestore -> `Rules`: defines who can mutate documents

- `vite-plugin-svgr` to import `svg` files as Components:

  - add plugin and types (`/// <reference types="vite-plugin-svgr/client" />`) to `vite.config.ts`
  - need to declare additional type for TypeScript support

  ```typescript
  // svg.d.ts
  declare module '*.svg' {
  	import type { FunctionComponent, SVGProps } from 'react';

  	export const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>;
  }
  ```

  - Syntax: `import { ReactComponent as Foo } from '@/assets/foo.svg'`
