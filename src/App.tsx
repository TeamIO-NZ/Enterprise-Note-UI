import { CssBaseline } from '@material-ui/core';
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MenuAppBar from './elements/MenuAppBar';
import Login from './pages/Login';
import User from './models/User'
import Home from './pages/Home';
import { UserContext } from './services/Context';
import Register from './pages/Register';
import UserList from './pages/UserList';
import ConnectionWarning from './elements/ConnectionWarning';

function App() {
  const [user, setUser] = React.useState<User>(new User("", "", false, "", "", "", -1, -1));
  console.log("App Level User:");
  console.log(user);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <React.Fragment>
        <CssBaseline />
        <MenuAppBar />
        <ConnectionWarning />
        <Switch>
          <Route exact path={["/", "/home"]} component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/users" component={UserList} />
        </Switch>
      </React.Fragment>
    </UserContext.Provider>
  );
}

export default App;
