// import { useEffect, useContext } from 'react' //rafce shortcut
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { Layout } from './layout';
import { AuthProvider } from './store';
import { Signin, Authenticate, ForgotPassword } from './authentication';
import { isLoggedIn } from './services/authService';
import { urlSlugs } from './services/urlService';

const ProtectedRoute = ({ children, ...rest }) => {
  return (
    <Route {...rest} render={({ location }) => {
      // console.log('location location', location)
      return isLoggedIn()
        ? children
        : <Redirect to={{
          pathname: `/${urlSlugs.signin}`,
          state: { from: location }
        }} />
    }} />
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Route exact path='/'><Redirect to={`/${urlSlugs.signin}`} /></Route>
        <Route exact path={`/${urlSlugs.authenticate}`} component={Authenticate} />
        <Route exact path={`/${urlSlugs.signin}`} component={Signin} />
        <Route exact path={`/${urlSlugs.forgotPassword}`} component={ForgotPassword} />
        <ProtectedRoute path='/app/:view'>
          <Layout />
        </ProtectedRoute>
      </Router>
    </AuthProvider>
  );
}

export default App;