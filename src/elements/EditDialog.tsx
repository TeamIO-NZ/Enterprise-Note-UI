import React, { Dispatch, SetStateAction } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import { TextField } from '@material-ui/core';
import MUIRichTextEditor from "mui-rte";
import NoteDataService from '../services/NoteServices'
import { Note } from '../models/Note';
import { convertToRaw } from 'draft-js';
import { useUser } from '../services/Context';

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
    }
  }),
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditDialog({ open, setOpen, editorId, note }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, editorId: number, note: Note }) {
  const classes = useStyles();
  const [data, setData] = React.useState<string>("");
  const [title, setTitle] = React.useState<string>("");
  const [desc, setDesc] = React.useState<string>("");
  const { user, setUser } = useUser();          //set user context. important for passing the user around the components      

  const handleClose = () => {
    setOpen(false);
  };

  const onChange = (data: any) => {
    setData(btoa(JSON.stringify(convertToRaw(data.getCurrentContent())))); // store to temp state
  }

  const handleSave = () => {
    let n = new Note(editorId === -1 ? 0 : note.id, title, desc, data, user.id, [], []);
    NoteDataService.create(n);
  };

  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              <TextField id="title" placeholder="Title" onChange={(e: any) => setTitle(e.target.value)} /> <TextField id="description" placeholder="Summary" onChange={(e: any) => setDesc(e.target.value)} />
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose && handleSave}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.editor}>
          <MUIRichTextEditor
            inlineToolbar={true}
            onChange={onChange}
            label="Type something here..."
            onSave={handleSave}
           // defaultValue={JSON.stringify(atob(note.content))} //TODO fix me
          />
        </div>
      </Dialog>
    </div>
  );
}