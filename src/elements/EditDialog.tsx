import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { createStyles, fade, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import { InputBase } from '@material-ui/core';
import MUIRichTextEditor from "mui-rte";
import NoteDataService from '../services/NoteServices'
import { Note } from '../models/Note';
import { convertToRaw, EditorState } from 'draft-js';
import { useUser } from '../services/Context';
import { Description, Title } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    editor: {
      margin: 40
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      margin: 3,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }),
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditDialog({ open, setOpen, note, setShouldRefresh }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, note: Note, setShouldRefresh: Function }) {
  const classes = useStyles();
  const [content, setContent] = React.useState<string>(note.content);
  const [title, setTitle] = React.useState<string>(note.title);
  const [desc, setDesc] = React.useState<string>(note.desc);
  const [data, setData] = React.useState<string>(JSON.stringify(convertToRaw(EditorState.createEmpty().getCurrentContent())));
  const { user, setUser } = useUser();          //set user context. important for passing the user around the components     

  const handleClose = () => {
    setShouldRefresh(String(Date.now())); // get epoch so it updates the var, refreshing the notes list
    setOpen(false);
  };

  const handleContentChange = (event: EditorState) => {
    setContent(btoa(JSON.stringify(convertToRaw(event.getCurrentContent()))));
  }

  const handleTitleChange = (e: any) => {
    setTitle(e.target.value)
  }

  const handleDescChange = (e: any) => {
    setDesc(e.target.value)
  }

  const saveAndClose = () => {
    handleSave();
    handleClose();
  }

  useEffect(() => {

    if (note.content == "") {
      console.log("fuckin empty")
      note.content = btoa(JSON.stringify(convertToRaw(EditorState.createEmpty().getCurrentContent())));
    } else {
      console.log("not empty")
    }
    setData(atob(note.content));
    setTitle(note.title);
    setDesc(note.desc);
  }, [note])

  const handleSave = () => {
    note.title = title;
    note.desc = desc;
    note.content = content;

    if (typeof (note.id) === 'number' && note.id > 0) {
      NoteDataService.update(note.id, note, user.id).then(() => {setShouldRefresh(String(Date.now()));});
    } else {
      NoteDataService.create(note).then((res) => { console.log(`create: ${res}`) }).then(() => {setShouldRefresh(String(Date.now()));});
    }
  };

  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => handleClose()} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <Title />
                </div>
                <InputBase
                  placeholder="Title"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'title' }}
                  onChange={handleTitleChange}
                  defaultValue={note.title}
                />
              </div>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <Description />
                </div>
                <InputBase
                  placeholder="Description"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  onChange={handleDescChange}
                  defaultValue={note.desc}
                />
              </div>

            </Typography>
            <Button color="inherit" onClick={() => saveAndClose()}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.editor}>
          <MUIRichTextEditor
            inlineToolbar={true}
            onChange={handleContentChange}
            label="Type something here..."
            onSave={handleSave}
            defaultValue={data}
          />
        </div>
      </Dialog>
    </div>
  );
}