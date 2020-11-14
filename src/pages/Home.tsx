import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Note } from '../models/Note';
import { IconButton, MenuItem, TextField } from '@material-ui/core';
import { useUser } from '../services/Context';
import { useHistory } from 'react-router-dom';
import { Add } from '@material-ui/icons';
import EditDialog from '../elements/EditDialog';
import NotesList from '../elements/NotesList';
import SearchBar from '../elements/SearchBar';

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


export default function Home() {
  const { user } = useUser();
  const history = useHistory();
  const classes = useStyles();
  const [notes, setNotes] = React.useState<Array<Note>>([]);
  const [editorOpen, setEditorOpen] = React.useState(false);

  const [activeNote, setActiveNote] = React.useState(new Note(0, "", "", "", user.id, [], []));
  const [shouldRefresh, setShouldRefresh] = React.useState("change-me-to-refresh");

  const handleCreateNew = () => {
    setActiveNote(new Note(0, "", "", "", user.id, [], []));
    setEditorOpen(true);
  }

  if (!user.loggedIn) {
    history.push("/login")
    return <div></div>;
  }


  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={2}
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={9} md={9}>
          <Grid
          container
          spacing={2}
          direction="row"
          justify="center"
          alignItems="center">
            <Grid item xs={3}>
              <Typography variant="h6" className={classes.title}>
                Your Notes
              <IconButton onClick={() => handleCreateNew()}><Add /></IconButton>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <SearchBar />
            </Grid>
            <Grid item xs={3}>
            </Grid>

          </Grid>
        </Grid>
        <Grid item xs={9} md={9}>
          <NotesList 
            shouldRefresh={shouldRefresh} 
            setShouldRefresh={setShouldRefresh} 
            notes={notes}
            setNotes={setNotes}
            setActiveNote={setActiveNote}
            setEditorOpen={setEditorOpen}
            />
        </Grid>
      </Grid>

      <EditDialog open={editorOpen} setOpen={setEditorOpen} note={activeNote} setShouldRefresh={setShouldRefresh} />
    </div>
  );
}
//}