import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, CircularProgress, Divider, IconButton, List, ListItem, Tooltip, Typography } from "@material-ui/core";
import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useUser } from "../services/Context";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Note } from "../models/Note";
import NoteServices from "../services/NoteServices";
import { ExpandMore, Delete, Edit } from "@material-ui/icons";
import { draftToMarkdown } from "markdown-draft-js";
import ReactMarkdown from "react-markdown";
import NoteShareGroup from "./NoteShareGroup";
import gfm from 'remark-gfm';
import { useIsMounted } from 'react-tidy';


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
export default function NotesList({
    shouldRefresh, 
    setShouldRefresh,
    notes,
    setNotes,
    setActiveNote,
    setEditorOpen

}: {
    shouldRefresh: string, 
    setShouldRefresh: React.Dispatch<React.SetStateAction<string>>,
    notes: Array<Note>,
    setNotes: React.Dispatch<React.SetStateAction<Array<Note>>>,
    setActiveNote: React.Dispatch<React.SetStateAction<Note>>,
    setEditorOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { user } = useUser();
    const classes = useStyles();
    const [dense] = React.useState(false);
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const isMounted = useIsMounted();
    const [isLoaded, setIsLoaded] = React.useState(false);


    const handleExpand = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    const handleOpenEditor = (index: number) => {
        setActiveNote(notes[index]);
        setEditorOpen(true);
    }
    const deleteNote = (noteId: number) => {
        console.log("Click")
        NoteServices.delete(noteId).then((response) => {
            console.log(response);
            setShouldRefresh(String(Date.now()));
        });
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
    if (!isLoaded) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    } else {
        return (
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
        )
    }
}
