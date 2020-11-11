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
import { CircularProgress, Grid, LinearProgress } from '@material-ui/core';

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

export default function Register() {
  const classes = useStyles();
  const [usernameInvalid, setUsernameInvalid] = React.useState<boolean>(false);
  const [emailInvalid, setEmailInvalid] = React.useState<boolean>(false);
  const [passwordInvalid, setPasswordInvalid] = React.useState<boolean>(false);
  const [passwordRepeatInvalid, setPasswordRepeatInvalid] = React.useState<boolean>(false);
  const [waiting, setWaiting] = React.useState<boolean>(false);
  const { user } = useUser();
  const history = useHistory();
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let pass = "";


  if (user.id !== -1) {
    history.push("/"); // prevent logged in users from registering.
  }

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    if ((/\s/g.test(e.target.value))) {
      setUsernameInvalid(true);
    } else {
      setUsernameInvalid(false);
    }
  }

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if ((re.test(e.target.value))) {
      setEmailInvalid(false);
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
    processJsonResponse();
    setWaiting(true);
    setTimeout(() => {
      setWaiting(false);
    }, 5000);
    e.preventDefault();

  }
  const processJsonResponse = () => {
    //TODO THIS TECHNICALLY WORKS SO IF YOU CONNECT VALIDATED VALUES TO IT THIS SHOULD BE DONE
    user.name = "james";
    user.password = "1234";
    user.email = "james@meme.com";
    console.log(user);
    UserService.create(user)
      .then((response: any) => {
        console.log(response)
        //UserService.getByName()
        console.log("hee hoo ")
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
            autoComplete="username"
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
            autoComplete="email"
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
            autoComplete="current-password"
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
            error={passwordInvalid}
            onChange={handlePassword}
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