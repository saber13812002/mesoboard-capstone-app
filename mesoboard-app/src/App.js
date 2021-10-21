import { useState, useEffect, useContext } from 'react' //rafce shortcut
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { Layout } from './layout/index'
import { AuthContext, AuthProvider } from './store/index';
import { Signin, VerifyPermission } from './authentication/index';

const ProtectedRoute = ({ children, ...rest }) => {
  const { token } = useContext(AuthContext)

  return (
    <Route {...rest} render={({ location }) => {
      console.log('location location', location)
      return token
        ? children
        : <Redirect to={{
          pathname: '/signin',
          state: { from: location }
        }} />
    }} />
  )
}

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Route exact path='/'><Redirect to='/signin' /></Route>
        <Route exact path='/authenticate' component={VerifyPermission} />
        <Route exact path='/signin' component={Signin} />
        <ProtectedRoute path='/app/:view'>
          <Layout />
        </ProtectedRoute>
      </Router>
    </AuthProvider>
  );
}

export default App;
