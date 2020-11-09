import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Note, Notes } from '../models/Note';
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

function generate(element: React.ReactElement, notes: Array<Note>) {
  return notes.map((note: Note, index: number) =>
    React.cloneElement(
      element,
      {
        key: note.id,
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

export default function Home() {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [notes, setNotes] = React.useState<Array<Note>>([]);
  const [dense] = React.useState(false);



  useEffect(() => {
    NoteServices.getData(2)
      .then(data => {
        var n: Array<Note> = [];
        if (data === undefined || data === null) return [];
        data.forEach((element: any) => {
          n.push(new Note(element.Id, element.Title, element.Desc, element.Content, element.Owner, element.Viewers, element.Editors));
        });
        return n;
      })
      .then(
        (notes: Array<Note>) => {
          setNotes(notes);
          setIsLoaded(true);
        }
      )
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>
  } else {
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
                    </ListItem>,
                    notes
                  )
                }
              </List>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}