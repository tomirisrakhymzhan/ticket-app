import 'bootstrap/dist/css/bootstrap.css';//global import, i.e. seen by all pages(routes)
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
      <div>
       <Header currentUser={currentUser}/>
        <Component {...pageProps} />
      </div>);
};

AppComponent.getInitialProps = async (appContext) => {
  // console.log(appContext);
  const client = buildClient(appContext.ctx);
  //getting information that would be common for every page
  const { data } = await client.get('/api/users/currentuser');
  
  let pageProps = {};
  if(appContext.Component.getInitialProps){
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }


  return data;
}
export default AppComponent;