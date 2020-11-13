import React, { cloneElement, useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Note } from '../models/Note';
import { AccordionActions, AccordionDetails, Divider, IconButton, ListItem, MenuItem, TextField, Tooltip, CircularProgress } from '@material-ui/core';
import NoteServices from '../services/NoteServices';
import { useUser } from '../services/Context';
import { useHistory } from 'react-router-dom';
import Accordion from '@material-ui/core/Accordion/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary/AccordionSummary';
import { Add, Delete, Edit, ExpandMore } from '@material-ui/icons';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import EditDialog from '../elements/EditDialog';
import { draftToMarkdown } from 'markdown-draft-js';
import { useIsMounted } from 'react-tidy';
import NoteShareGroup from '../elements/NoteShareGroup';

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

function generate(element: React.ReactElement, notes: Array<Note>, { expanded, handleExpand, classes, handleOpenEditor, deleteNote }: { expanded: string | boolean, handleExpand: any, classes: any, handleOpenEditor: any, deleteNote: any }) {
  return notes.map((note: Note, index: number) => React.cloneElement(
    element,
    {
      key: index
    },
    <Accordion className={classes.item} expanded={expanded === `panel${index}`} onChange={handleExpand(`panel${index}`)}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls={`panel${index}bh-content`}
        id={`panel${index}bh-header`}
      >
        <Typography className={classes.heading}>{note.title}</Typography>
        <Typography className={classes.secondaryHeading}>{note.desc}</Typography>
      </AccordionSummary>
      <AccordionActions>
      <NoteShareGroup note={note}></NoteShareGroup>
        <Tooltip title={"Delete Note"}><IconButton size="small" onClick={() => deleteNote(note.id)}><Delete /></IconButton></Tooltip>
        <Tooltip title={"Edit Note"}><IconButton size="small" onClick={() => handleOpenEditor(index)}><Edit /></IconButton></Tooltip>
      </AccordionActions>
      <Divider />
      <AccordionDetails>
      <ReactMarkdown plugins={[gfm]} children={draftToMarkdown(JSON.parse(atob(note.content)))} />
    </AccordionDetails>
    </Accordion>
  ),
  );
}
const searchTypes = [
  {
    value: "Regex",
    tooltip: "A sentence with a given prefix or suffix"
  },
  {
    value: "Phone",
    tooltip: "A phone number with a give area code and/or consecutive number pattern"
  },
  {
    value: "Email",
    tooltip: "An email address on a domain that is only partially provided"
  },
  {
    value: "Three Words",
    tooltip: "Text that contains at least three of the following case sensitive words. [meeting, minutes, agenda, action, attendees, apologies]"
  },
  {
    value: "3 Letter word",
    tooltip: "A 3+ letter word thats all caps"
  },
]
export default function Home() {
  const { user } = useUser();
  const history = useHistory();
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [notes, setNotes] = React.useState<Array<Note>>([]);
  const [dense] = React.useState(false);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const isMounted = useIsMounted();
  const [searchType, setSearchType] = React.useState("regex")
  const [searchLock, setSearchLock] = React.useState(false);
  const [searchCount, setSearchCount] = React.useState(0);
  const [activeNote, setActiveNote] = React.useState(new Note(0, "", "", "", user.id, [], []));
  const [shouldRefresh, setShouldRefresh] = React.useState("change-me-to-refresh");

  const handleExpand = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  const deleteNote = (noteId: number) => {
    console.log("Click")
    NoteServices.delete(noteId).then((response) => {
      console.log(response);
      setShouldRefresh(String(Date.now()));
    });
  }
  const handleCreateNew = () => {
    setActiveNote(new Note(0, "", "", "", user.id, [], []));
    setEditorOpen(true);
  }
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchType(event.target.value)
    
    if (event.target.value === "Regex" || event.target.value === "Phone" || event.target.value === "Email") {
      setSearchLock(false);
    }
    else {
      setSearchLock(true);
    }
  }

  const handleOpenEditor = (index: number) => {
    setActiveNote(notes[index]);
    setEditorOpen(true);
  }

  useEffect(() => {
    setIsLoaded(false);
    NoteServices.getData(user.id)
      .then(data => {
        var n: Array<Note> = [];
        if (data === undefined || data === null) return [];
        data.forEach((element: any) => {
          console.log(element.id)
          n.push(new Note(element.id, element.title, element.desc, element.content, element.owner, element.viewers, element.editors));
        });
        return n;
      })
      .then(
        (n: Array<Note>) => {
          if (isMounted()) {
            setNotes(n);
            setIsLoaded(true);
          }
        }
      )
  }, [user.id, isMounted, shouldRefresh]);

  if (!user.loggedIn) {
    history.push("/login")
    return <div></div>;
  }

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
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
          <Grid item xs={12} md={12}>
            <Typography variant="h6" className={classes.title}>
              Your Notes
              <IconButton onClick={() => handleCreateNew()}><Add /></IconButton>
              <TextField id="standard-basic" label="Search..." disabled={searchLock} />
              <TextField
                id="standard-select-searchType"
                select
                label="Select"
                value={searchType}
                onChange={handleSearchChange}
                helperText={`There are currently ${searchCount} results`}>
                {searchTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value}
                    </MenuItem>
                ))}
              </TextField>
            </Typography>
            <List dense={dense}>
              {
                generate(
                  <ListItem>
                  </ListItem>,
                  notes,
                  {
                    expanded,
                    handleExpand,
                    classes,
                    handleOpenEditor,
                    deleteNote
                  }
                )
              }
            </List>
          </Grid>
          <Grid item xs={12} md={6}>

          </Grid>
        </Grid>

        <EditDialog open={editorOpen} setOpen={setEditorOpen} note={activeNote} setShouldRefresh={setShouldRefresh}/>
      </div>
    );
  }
}