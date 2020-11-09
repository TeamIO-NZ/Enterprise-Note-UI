import React, { Children } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {Note,Notes} from '../models/Note';
import { ListItem, ListItemText } from '@material-ui/core';
import NoteServices from '../services/NoteServices';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: 500,
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
  }),
);
function processData() {
  var i:number = 0;
  var notes:Notes = new Notes('MainNotes',[]); 

  NoteServices.getData().then(responseData => {
    responseData.forEach((element: any) => {
      //console.log(element.Title);
      var note = new Note(element.Id, element.Title, element.Desc, element.Content, element.Owner, element.Viewers, element.Editors);
      notes.notes.push(note);
    });
    //console.log(notes);
  })
  return notes;
};
//TODO JOE FIX THIS FOR ME ^^
function generate(element: React.ReactElement) {

  var notes = processData();
  console.log(notes);
  return  notes.notes.map((note) =>
    React.cloneElement(
      element,
      {
        //key: value.key,
      },
      React.cloneElement(
        <ListItemText />,
        {
          primary: note.title,
          secondary: note.desc,
        }
      )
    ),

  );
}
/*
  // return [
  //   {
  //     name: "James",
  //     title: "This is a title",
  //     content: "this is some content"
  //   },
  //   {
  //     name: "Joe",
  //     title: "This is a another title",
  //     content: "this is some content"
  //   },
  //   {
  //     name: "Sam",
  //     title: "This is the best title",
  //     content: "this is some content"
  //   },
  // ]*/ 
export default function Home() {
  const classes = useStyles();
  const [dense] = React.useState(false);
  var notes = [
    {
      name: "James",
      title: "This is a title",
      content: "this is some content"
    },
    {
      name: "Joe",
      title: "This is a another title",
      content: "this is some content"
    },
    {
      name: "Sam",
      title: "This is the best title",
      content: "this is some content"
    },
  ]
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={classes.title}>
            Text only
            </Typography>
          <div className={classes.demo}>
            <List dense={dense}>
              {
                generate(
                  <ListItem>
                  </ListItem>
                )
              }
            </List>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
