import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Note } from '../models/Note';
import { AccordionActions, AccordionDetails, Button, Divider, Fab, IconButton, ListItem, Tooltip } from '@material-ui/core';
import NoteServices from '../services/NoteServices';
import { useUser } from '../services/Context';
import { Redirect } from 'react-router-dom';
import Accordion from '@material-ui/core/Accordion/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary/AccordionSummary';
import { Add, Delete, Edit, ExpandMore } from '@material-ui/icons';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import EditDialog from '../elements/EditDialog';
import { draftToMarkdown } from 'markdown-draft-js';

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

function generate(element: React.ReactElement, notes: Array<Note>, { expanded, handleExpand, classes, setEditorOpen }: { expanded: string | boolean, handleExpand: any, classes: any, setEditorOpen: any }) {
  return notes.map((note: Note, index: number) =>
    React.cloneElement(
      element,
      {
        key: note.id
      },
      <Accordion className={classes.item} expanded={expanded === `panel${note.id}`} onChange={handleExpand(`panel${note.id}`)}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls={`panel${note.id}bh-content`}
          id={`panel${note.id}bh-header`}
        >
          <Typography className={classes.heading}>{note.title}</Typography>
          <Typography className={classes.secondaryHeading}>{note.desc}</Typography>
        </AccordionSummary>
        <AccordionActions>
          <Tooltip title={"Delete Note"}><IconButton size="small"><Delete /></IconButton></Tooltip>
          <Tooltip title={"Edit Note"}><IconButton size="small" onClick={() => setEditorOpen(true)}><Edit /></IconButton></Tooltip>
        </AccordionActions>
        <Divider />
        <AccordionDetails>
          <ReactMarkdown plugins={[gfm]} children={draftToMarkdown(atob(note.content))} />
        </AccordionDetails>
      </Accordion>
    ),
  );
}

export default function Home() {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [notes, setNotes] = React.useState<Array<Note>>([]);
  const [dense] = React.useState(false);
  const { user } = useUser();

  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editorId, setEditorId] = React.useState<number>(-1);

  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleExpand = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleCreateNew = () => {
    setEditorId(-1);
    setEditorOpen(true);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    NoteServices.getData(user.id)
      .then(data => {
        console.log(data)
        var n: Array<Note> = [];
        if (data === undefined || data === null) return [];
        data.forEach((element: any) => {
          n.push(new Note(element.userid, element.title, element.desc, element.content, element.owner, element.viewers, element.editors));
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
              Your Notes
              <IconButton onClick={() => handleCreateNew()}><Add /></IconButton>
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
                    setEditorOpen
                  }
                )
              }
            </List>
          </Grid>
          <Grid item xs={12} md={6}>

          </Grid>
        </Grid>

        <EditDialog open={editorOpen} setOpen={setEditorOpen} editorId={editorId} ownerId={user.id}/>
      </div>
    );
  }
}