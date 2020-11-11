/// <reference path="../../.types/remark-twemoji.d.ts" />

import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Note } from '../models/Note';
import { AccordionDetails, ListItem } from '@material-ui/core';
import NoteServices from '../services/NoteServices';
import { useUser } from '../services/Context';
import {Redirect} from 'react-router-dom';
import Accordion from '@material-ui/core/Accordion/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary/AccordionSummary';
import { ExpandMore } from '@material-ui/icons';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: 500,
      marginLeft: 40
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
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
    listRoot: {
      width: '100%'
    }
  }),
);

function generate(element: React.ReactElement, notes: Array<Note>, {expanded, handleExpand, classes}: {expanded: string | boolean, handleExpand: any, classes: any}) {
  return notes.map((note: Note, index: number) =>
    React.cloneElement(
      element,
      {
        key: note.id
      },
      <Accordion expanded={expanded === `panel${note.id}`} onChange={handleExpand(`panel${note.id}`)}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls={`panel${note.id}bh-content`}
          id={`panel${note.id}bh-header`}
        >
          <Typography className={classes.heading}>{note.title}</Typography>
          <Typography className={classes.secondaryHeading}>{note.desc}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ReactMarkdown plugins={[gfm]} children={decodeURIComponent(note.content)}/>
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
  const {user} = useUser();

  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleExpand = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };


  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    NoteServices.getData(user.id)
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
          setNotes(notes);   // For these two react freaks
          setIsLoaded(true); //  out about a menory leak, idk why ~Joe
        }
      )
  }, []);
  if(!user.loggedIn){
    return <Redirect to="/login" />
  }
  if (!isLoaded) {
    return <div>Loading...</div>
  } else {
    return (
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className={classes.title}>
              Your Notes
            </Typography>
            <div className={classes.demo}>
              <List dense={dense} className={classes.listRoot}>
                {
                  generate(
                    <ListItem>
                    </ListItem>,
                    notes,
                    {
                      expanded, 
                      handleExpand,
                      classes
                    }
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