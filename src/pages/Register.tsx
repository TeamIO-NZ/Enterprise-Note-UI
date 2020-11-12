import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link, useHistory } from "react-router-dom";
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import User from '../models/User';
import UserService from '../services/UserServices';
import { useUser } from '../services/Context';
import { CircularProgress, Grid } from '@material-ui/core';
import Copyright from '../elements/Copyright';

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

export default function Register() {
  const classes = useStyles();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");

  const [usernameInvalid, setUsernameInvalid] = React.useState<boolean>(false);
  const [emailInvalid, setEmailInvalid] = React.useState<boolean>(false);
  const [passwordInvalid, setPasswordInvalid] = React.useState<boolean>(false);
  const [passwordRepeatInvalid, setPasswordRepeatInvalid] = React.useState<boolean>(false);
  const [waiting, setWaiting] = React.useState<boolean>(false);

  const { user, setUser } = useUser();
  const history = useHistory();
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let pass = "";


  if (user.id > 0) {
    history.push("/"); // prevent logged in users from registering.
  }

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!(/\s/g.test(e.target.value)) && e.target.value !== "") { // valid name
      let name = e.target.value.toLowerCase();
      UserService.getByName(name)
        .then((res) => {
          if (res.data.name === "") { // user not in use
            setUsername(name);
            setUsernameInvalid(false);
          } else {
            setUsernameInvalid(true);
          }
        });
    } else {
      setUsernameInvalid(true);
    }
  }

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if ((re.test(e.target.value))) {
      let email = e.target.value.toLowerCase();
      UserService.getByEmail(email)
        .then((res) => {
          if (res.data.email === "") {
            setEmail(email);
            setEmailInvalid(false);
          } else {
            setEmailInvalid(true);
          }
        });
    } else {
      setEmailInvalid(true);
    }
  }

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setPasswordInvalid(true);
      console.log("invalid password")

    } else {
      setPasswordInvalid(false);
      setPassword(e.target.value);
      //  console.log("setting password in user to: " + user.password)
    }
  }

  const handleRepeatPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "" || (e.target.value === pass && pass !== "")) {
      setPasswordRepeatInvalid(true);
    } else {
      setPasswordInvalid(false);
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    setWaiting(true);
    e.preventDefault();

    user.name = username;
    user.password = password;
    user.email = email;
    user.id = 0;

    UserService.create(user)
      .then((response: any) => {
        console.log(response)
        console.log(user)
        UserService.login(username, password)
          .then((response: any) => {
            console.log("login response")
            console.log(response)
            var userInfo = response.data.data;
            var token = userInfo.token;
            console.log(token);
            var decoded = atob(userInfo.token)
            if (decoded === username + password) {
              console.log("Time to login");
              setUser(new User(userInfo.name, userInfo.password, true, userInfo.token, userInfo.email, userInfo.gender, userInfo.userId));
              console.log(user);
              console.log("Time to push to home")
              history.push("/")
            }
          })
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
          Register
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
            error={usernameInvalid}
            onChange={handleUsername}
            disabled={waiting}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            error={emailInvalid}
            onChange={handleEmail}
            disabled={waiting}
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
            onChange={handlePassword}
            disabled={waiting}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="repeat-password"
            label="Repeat Password"
            type="password"
            id="repeat-password"
            error={passwordRepeatInvalid}
            onChange={handleRepeatPassword}
            disabled={waiting}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={usernameInvalid || passwordInvalid || waiting}
            className={classes.submit}
            onClick={handleSubmit}
          >
            {
              waiting ? <CircularProgress size={25} /> : "Register"
            }

          </Button>

        </form>
        <Grid container>
          <Grid item xs></Grid>
          <Grid item>
            <Link to="/login">
              {"Already have an account? Login"}
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