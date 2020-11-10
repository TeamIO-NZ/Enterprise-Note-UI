import { CssBaseline } from '@material-ui/core';
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MenuAppBar from './elements/MenuAppBar';
import Login from './pages/Login';
import User from './models/User'
import Home from './pages/Home';
import { UserContext } from './services/Context';

function App() {

  const [token, setToken] = React.useState<String>("");
  const [user, setUser] = React.useState<User>(new User("", "", false, "","","",-1));
  console.log("App Level User:");
  console.log(user);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <React.Fragment>
        <CssBaseline />
        <MenuAppBar token={token} />
        <Switch>
          <Route exact path={["/", "/home"]} component={Home}> 
          <Home/>
          </Route>
          <Route exact path="/login" component={Login}>
            <Login />
            </Route>
        </Switch>
      </React.Fragment>
    </UserContext.Provider>
  );
}

export default App;
