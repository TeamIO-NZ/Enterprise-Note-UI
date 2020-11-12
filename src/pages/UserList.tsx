import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { AccordionActions, AccordionDetails, Divider, IconButton, ListItem, Tooltip } from '@material-ui/core';
import { useUser } from '../services/Context';
import { Redirect } from 'react-router-dom';
import Accordion from '@material-ui/core/Accordion/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary/AccordionSummary';
import { Delete, Edit, ExpandMore } from '@material-ui/icons';
import User from '../models/User';
import UserServices from '../services/UserServices';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginLeft: 40

    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    item: {
      width: '100%'
    }
  }),
);

function generate(element: React.ReactElement, users: Array<User>, { expanded, handleExpand, classes, deleteUser }: { expanded: string | boolean, handleExpand: any, classes: any, deleteUser: any }) {
  //console.log(users);
  return users.map((user: User) =>
    React.cloneElement(
      element,
      {
        key: user.id
      },
      <Accordion className={classes.item} expanded={expanded === `panel${user.id}`} onChange={handleExpand(`panel${user.id}`)}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls={`panel${user.id}bh-content`}
          id={`panel${user.id}bh-header`}
        >
          <Typography className={classes.heading}>{user.name}</Typography>
          <Typography className={classes.secondaryHeading}>{user.email}</Typography>
        </AccordionSummary>
        <AccordionActions>
          <Tooltip title={"Delete User"}><IconButton onClick={ () => deleteUser(user.id)} size="small"><Delete /></IconButton></Tooltip>
          <Tooltip title={"Edit User"}><IconButton size="small"><Edit /></IconButton></Tooltip>
        </AccordionActions>
        <Divider />
        <AccordionDetails>
          <Typography className={classes.heading}>{user.gender}</Typography>
        </AccordionDetails>
      </Accordion>
    ),
  );
}

export default function Home() {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [users, setUsers] = React.useState<Array<User>>([]);
  const [dense] = React.useState(false);
  const { user } = useUser();

  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleExpand = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const deleteUser = (userId: number) => {
    console.log("Click")
    UserServices.delete(userId).then((response) =>{
      console.log(response);
    });
  }


  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    UserServices.getData()
      .then(data => {
        var n: Array<User> = [];
        if (data === undefined || data === null) return [];
        data.forEach((element: any) => {
          n.push(new User(element.name, "", false, "", element.email, element.gender, element.userId));
        });
        return n;
      })
      .then(
        (users: Array<User>) => {
          setUsers(users);
          setIsLoaded(true);
        }
      )
  }, []);
  if (!user.loggedIn) {
    return <Redirect to="/login" />
  }
  if (!isLoaded) {
    return <div>Loading...</div>
  } else {
    return (
      <div className={classes.root}>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className={classes.title}>
              List of Users
            </Typography>
            <List dense={dense}>
              {
                generate(
                  <ListItem>
                  </ListItem>,
                  users,
                  {
                    expanded,
                    handleExpand,
                    classes,
                    deleteUser
                  }
                )
              }
            </List>
          </Grid>
          <Grid item xs={12} md={6}>

          </Grid>
        </Grid>
      </div>
    );
  }
}