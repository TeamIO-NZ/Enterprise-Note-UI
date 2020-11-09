import { CssBaseline } from '@material-ui/core';
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MenuAppBar from './elements/MenuAppBar';
import Login from './pages/Login';
import user from './models/User'
import Home from './pages/Home';

function App(noteArray?:any) {
  const [token, setToken] = React.useState<String>("");
  const [user, setUser] = React.useState<user>();
  
  return (
    <React.Fragment>
      <CssBaseline />
      <MenuAppBar token={token}/>
      <Switch>
        <Route exact path={["/", "/home"]} component={Home}/>
        <Route exact path="/login" component={Login} user={setUser}/>
      </Switch>
    </React.Fragment>
  );
}

export default App;
