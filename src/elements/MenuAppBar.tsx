import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import { useHistory, useLocation } from "react-router-dom";
import { Avatar } from '@material-ui/core';
import { useUser } from '../services/Context';
import User from '../models/User';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

export default function MenuAppBar() {
  const { user, setUser } = useUser();
  const history = useHistory();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  let loc = useLocation();
  let hideLogin: boolean = (loc.pathname === "/login" || loc.pathname === "/register");

  const handleLogin = () => {
    history.push("/login");
  }
  const handleUserListPush = () =>{
    history.push("/users");
  }
  const handleMyNotesPush = () =>{
    history.push("/");
  }
  const handleLogout = () => {
    setUser(new User("", "", false, "","","",-1));
    history.push("/login");
  }

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Enterprise Note
          </Typography>
          {user.token !== "" && (
            <div>
              <Avatar
              aria-label={`account of ${user.name}`}
              aria-controls="menu-appbar"
              onClick={handleMenu}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => {handleMyNotesPush(); handleClose()}}>My Notes</MenuItem>
                <MenuItem onClick={() => {handleUserListPush();handleClose()}}>UserList</MenuItem>
                <MenuItem onClick={() => {handleLogout();handleClose();}}>Logout</MenuItem>
              </Menu>
            </div>
          )}
          {
            !hideLogin && user.token === "" && (
              <Button color="inherit" onClick={handleLogin && handleClose}>Login</Button>
            )
          }
        </Toolbar>
      </AppBar>
    </div>
  );
};