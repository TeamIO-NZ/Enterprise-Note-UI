import { CssBaseline } from '@material-ui/core';
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MenuAppBar from './elements/MenuAppBar';
import Login from './pages/Login';
import User from './models/User'
function App() {
  const [token, setToken] = React.useState<String>("");
  const [User, setUser] = React.useState<User>()
  return (
    <React.Fragment>
      <CssBaseline />
      <MenuAppBar token={token}/>
      <Switch>
        <Route exact path={["/", "/home"]} />
        <Route exact path="/login" component={Login}/>
      </Switch>
    </React.Fragment>
  );
}

export default App;
