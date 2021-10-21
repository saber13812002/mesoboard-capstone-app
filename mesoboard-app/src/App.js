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

  useEffect(async () => {
    // fetch("/api")
    //   .then((res) => res.json())
    //   .then((data) => setData(data.message));
    const data = {
      code: '2212',
      password: 'test123'
    }

    const fetchApi = async () => {
      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)

      }) //dummy url to simulate fetch
        // .then(data => console.log('data', data))
        .then(data => data.json())
        .then(res => {
          console.log('res', res)
        })
    }
    fetchApi()
  }, []);

  return (
    // <p>{!data ? "Loading..." : data}</p>
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
