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
      <AccordionActions disableSpacing={true}>
        <NoteShareGroup note={note}/>
        <Tooltip title={"Delete Note"}><IconButton size="small" onClick={() => deleteNote(note.id)}><Delete /></IconButton></Tooltip>
        <Tooltip title={"Edit Note"}><IconButton size="small" onClick={() => handleOpenEditor(index)}><Edit /></IconButton></Tooltip>
      </AccordionActions>
      <Divider />
      <AccordionDetails>
        {/* draftToMarkdown(JSON.parse(atob(note.content))) */}
        {/* ![](data:image/jpeg;base64,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) */}
        <ReactMarkdown plugins={[gfm]} children={draftToMarkdown(JSON.parse(atob(note.content)))} />
        {/* <Typography>
          {atob(note.content)}
        </Typography> */}
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
          n.push(new Note(element.id, element.title, element.desc, element.content, element.owner, element.viewers ?? [], element.editors ?? []));
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
          <Grid item xs={12} md={6}>
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