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
import { useIsMounted } from 'react-tidy';

//standard material ui stylesheet stuff
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
//main login component
export default function Login() {
  const classes = useStyles();                  //Sets styles for components
  const [usernameInvalid, setUsernameInvalid] = React.useState<boolean>(false);   //used for checking username validity
  const [passwordInvalid, setPasswordInvalid] = React.useState<boolean>(false);   //used for checking password validity
  const [waiting, setWaiting] = React.useState<boolean>(false); // used to wait for response from api, check valid creds.
  const { user, setUser } = useUser();          //set user context. important for passing the user around the components      
  const history = useHistory();                 //set history context for better routing
  const isMounted = useIsMounted();

  //if user is logged in we dont need to be here. go to the notes page
  if (user.id !== -1) {
    if(isMounted()) {
      history.push("/");
    }
    
  }
  console.log("Before Handles");
  //check username for white space and denies validity if it has it
  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleUsername");
    if ((/\s/g.test(e.target.value))) {
      setUsernameInvalid(true);
    } else {
      setUsernameInvalid(false);
      user.name = e.target.value.toLowerCase();     //sets the user.name variable to a lowercase version of the name.
    }
  }
  //checks the passwords not blank
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("HandlePassword")
    if (e.target.value === "") {
      setPasswordInvalid(true);
      console.log("invalid password")
    } else {
      setPasswordInvalid(false);
      user.password = e.target.value;
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    
    e.preventDefault();
    processJsonResponse(user.name, user.password);
  }
  //TODO work out how to pull users shared settings based on userInfo.sharedSettingID that doesnt exist in the front end yet
  //do the actual work to find out if login stuff is correct
  const processJsonResponse = (username: string, password: string) => {
    //call the login function then process the data and decode the token and check its valid. if it is set user to the response and push to the home page
    UserService.login(username, password)
      .then((response: any) => {
        if (isMounted()) {
          setWaiting(false);
          if (response.data.data) {
            var userInfo = response.data.data;
            var token = userInfo.token;
            console.log(token);
            var decoded = atob(userInfo.token)
            if (decoded === username + password) {
              setUser(new User(userInfo.name, userInfo.password, true, userInfo.token, userInfo.email, userInfo.gender, userInfo.userId));
              history.push("/");
            }
          } else {
            setUsernameInvalid(true);
            setPasswordInvalid(true);
          }
        }
      });
  }
  //return the render info for the components for this page
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
            onChange={(e: any) => handleUsername(e)}
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
            onChange={(e: any) => handlePassword(e)}
            disabled={waiting}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={(usernameInvalid && passwordInvalid) || waiting}
            className={classes.submit}
            onClick={(e: any) => handleSubmit(e)}
          >
            {
              waiting ? <CircularProgress size={25} /> : "Login"
            }

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