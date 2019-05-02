import Head from 'next/head';
import { importedFont } from '../../config';

const Meta = () => (
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charSet="utf-8" />
    <link rel="icon" type="image/png" href="/static/favicon.png" />
    <link
      href={`https://fonts.googleapis.com/css?family=${importedFont}`}
      rel="stylesheet"
    />
    <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
    <title>CS50 Jeopardy !</title>
  </Head>
);

export default Meta;
