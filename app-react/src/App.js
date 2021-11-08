// import { useEffect, useContext } from 'react' //rafce shortcut
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { Layout } from './layout'
import { AuthProvider } from './store';
import { Signin, Authenticate } from './authentication';
import { isLoggedIn } from './services/authService'

const ProtectedRoute = ({ children, ...rest }) => {
  return (
    <Route {...rest} render={({ location }) => {
      // console.log('location location', location)
      return isLoggedIn()
        ? children
        : <Redirect to={{
          pathname: '/signin',
          state: { from: location }
        }} />
    }} />
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Route exact path='/'><Redirect to='/signin' /></Route>
        <Route exact path='/authenticate' component={Authenticate} />
        <Route exact path='/signin' component={Signin} />
        <ProtectedRoute path='/app/:view'>
          <Layout />
        </ProtectedRoute>
      </Router>
    </AuthProvider>
  );
}

export default App;