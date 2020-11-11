import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Link, useHistory } from "react-router-dom";
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import User from '../models/User';
import UserService from '../services/UserServices';
import { useUser } from '../services/Context';
import { Grid } from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" to="https://github.com/TeamIO-NZ/EnterpriseNote">
        Enterprise Note
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();
  const [usernameInvalid, setUsernameInvalid] = React.useState<boolean>(false);
  const [passwordInvalid, setPasswordInvalid] = React.useState<boolean>(false);
  const { user, setUser } = useUser();
  const history = useHistory();

  if(user.id != -1) {
    history.push("/");
  }

   const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    if ((/\s/g.test(e.target.value))) {
      setUsernameInvalid(true);
    } else {
      setUsernameInvalid(false);
      user.name = e.target.value.toLowerCase();
    }
  }

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setPasswordInvalid(true);
      console.log("invalid password")

    } else {
      setPasswordInvalid(false);
      user.password = e.target.value;
    //  console.log("setting password in user to: " + user.password)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {

    e.preventDefault();
    processJsonResponse(user.name, user.password);
    console.log(user.name);
   // console.log(user.password);
  }
  const processJsonResponse = (username: string, password: string) => {
    UserService.login(username, password)
    .then((response: any) => {
        //console.log(response.data.data);
        var userInfo = response.data.data;
        var token = userInfo.Token;
        console.log(token);
        var decoded = atob(userInfo.Token)
        if (decoded === username + password) {
          setUser(new User(userInfo.name, userInfo.Password, true, userInfo.Token,userInfo.Email,userInfo.Gender,userInfo.ID));
          history.push("/");
        }
      })
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            error={usernameInvalid}
            onChange={handleUsername}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            error={passwordInvalid}
            autoComplete="current-password"
            onChange={handlePassword}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={usernameInvalid && passwordInvalid}
            className={classes.submit}
            onClick={handleSubmit}
          >
            Login

          </Button>

        </form>
        <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link to="/register">
                {"Don't have an account? Register"}
              </Link>
            </Grid>
          </Grid>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}