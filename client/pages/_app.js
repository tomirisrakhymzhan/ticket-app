import 'bootstrap/dist/css/bootstrap.css';//global import, i.e. seen by all pages(routes)

export default ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};