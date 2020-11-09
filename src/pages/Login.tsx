import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import UserService from "../services/userServices";
import User from '../models/User';
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/TeamIO-NZ/EnterpriseNote">
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

export default function Login(user:User) {
  const classes = useStyles();
  
  const [username, setUsername] = React.useState<String>("");
  const [password, setPassword] = React.useState<String>("");
  const [usernameValid, setUsernameValid] = React.useState<boolean>(false);
  const [passwordValid, setPasswordValid] = React.useState<boolean>(false);

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    if((/\s/g.test(e.target.value))) {
        setUsernameValid(true);
    } else {
        setUsernameValid(false);
        setUsername(e.target.value);
    }
  }
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.value === "") {
        setPasswordValid(true);
    } else {
        setPasswordValid(false);
        setPassword(e.target.value);
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    console.log(username);
    console.log(password);
    e.preventDefault();
  }
  const processJsonResponse = (username: string, password: string) =>{
    UserService.login(username, password).
    then(response => {
      var decoded = atob(response.data)
      if(decoded === username+password){
        user = new User(username, password, true);
        console.log("logged in as " + user.name);
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
            error={usernameValid}
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
            error={passwordValid}
            autoComplete="current-password"
            onChange={handlePassword}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={usernameValid && passwordValid}
            className={classes.submit}
            onClick={handleSubmit}
          >
            Login
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}