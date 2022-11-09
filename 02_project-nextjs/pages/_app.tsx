// _app.tsx is a root component for every component used in the app
// Component that will be rendered and its pageProps are passed in
// use it to apply general components (as Layout, Footer ...) or settings
// that should affect all pages of app
import type { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
