import React, { useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import { Note } from '../models/Note';
import { DialogContent, FormControl, FormHelperText, InputLabel, ListItemSecondaryAction, MenuItem, Radio, Select, Tooltip } from '@material-ui/core';
import NoteServices from '../services/NoteServices';
import UserServices from '../services/UserServices';
import { useIsMounted } from 'react-tidy';
import { isNullOrUndefined } from 'util';
import { People } from '@material-ui/icons';

const emails = ['username@gmail.com', 'user02@gmail.com'];
const useStyles = makeStyles((theme: Theme) =>
  createStyles(
    {
      avatar: {
        backgroundColor: blue[100],
        color: blue[600],
      },
      actions: {
        marginLeft: 40
      },
      listText: {
        marginRight: 200
      },
      formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300
      },
    }
  )
);

export interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  note: Note;
  requestRefresh: Function;
}

export enum Role {
  None = 'None',
  Viewer = 'Viewer',
  Editor = 'Editor',
  Owner = 'Owner',
}

export default function ShareDialog(props: ShareDialogProps) {
  const classes = useStyles();
  const { onClose, open, note, requestRefresh } = props;
  const [users, setUsers] = React.useState<Array<{ userId: number, name: string, role: Role }>>([]);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted()) {
      console.log("use effect");
      UserServices.getAll()
        .then((res: any) => {
          console.log(res)
          if (isMounted()) {
            setUsers([]);
            let ul: Array<{ userId: number, name: string, role: Role }> = [];
            res.data.forEach((u: any) => {
              ul.push({
                name: u.name,
                userId: u.userId,
                role: getRole(u.userId)
              });
            });
            setUsers(ul);
          }
        });
    }

  }, [note]);

  const getRole = (uId: number): Role => {
    if(note.editors == null) {
      note.editors = [0];
    }

    if(note.viewers ==  null) {
      note.viewers = [0];
    }

    if (note.owner == uId) {
      return Role.Owner;
    } else if (note.editors.includes(uId)) {
      return Role.Editor;
    } else if (note.viewers.includes(uId)) {
      return Role.Viewer;
    } else {
      return Role.None;
    }

  }

  const handleClose = () => {
    NoteServices.update(note.id, note, note.owner).then(() => {
      requestRefresh(String(Date.now()));
      onClose();
    });

  };

  const handleRadioChange = (e: React.ChangeEvent<{ name?: string | undefined, value: unknown }>, user: { userId: number, name: string, role: Role }) => {
    let ul: Array<{ userId: number, name: string, role: Role }> = Object.assign([], users);
    if (e.target.value == Role.None) {
      ul[ul.indexOf(user)].role = Role.None
    } else if (e.target.value == Role.Viewer) {
      ul[ul.indexOf(user)].role = Role.Viewer
    } else if (e.target.value == Role.Editor) {
      ul[ul.indexOf(user)].role = Role.Editor
    }
    setUsers(ul);
  }


  // Jank code >:) ~Joe
  const clearUserRoles = (user: { userId: number, name: string, role: Role }) => {
    note.viewers = note.viewers.filter(id => id !== user.userId); // filter userId out of viewers
    note.editors = note.editors.filter(id => id !== user.userId); // filter userId out of editors
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="share-dialog-title" open={open}>
      <DialogTitle id="share-dialog-title">Share Note</DialogTitle>
        <List>
        <ListItem key="fuck">
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <People />
                </Avatar>
              </ListItemAvatar>
              <ListItemText className={classes.listText} ><b>Users</b></ListItemText>
              <ListItemSecondaryAction>
                <Typography>
                  <b>Roles</b>
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>
          {users.map((user: { userId: number, name: string, role: Role }) => (
            <ListItem key={`${user.userId}-${user.name}`}>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} className={classes.listText} />
              <ListItemSecondaryAction>
                <Tooltip title={Role.None}>
                  <Radio
                    checked={user.role == Role.None}
                    onChange={(e) => handleRadioChange(e, user)}
                    value={Role.None}
                    color="default"
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': Role.None }}
                    disabled={user.userId === note.owner}
                    size="small"
                  />
                </Tooltip>
                <Tooltip title={Role.Viewer}>
                  <Radio
                    checked={user.role == Role.Viewer}
                    onChange={(e) => handleRadioChange(e, user)}
                    value={Role.Viewer}
                    color="default"
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': Role.Viewer }}
                    disabled={user.userId === note.owner}
                    size="small"
                  />
                </Tooltip>
                <Tooltip title={Role.Editor}>
                  <Radio
                    checked={user.role == Role.Editor}
                    onChange={(e) => handleRadioChange(e, user)}
                    value={Role.Editor}
                    color="default"
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': Role.Editor }}
                    disabled={user.userId === note.owner}
                    size="small"
                  />
                </Tooltip>

                {/* <FormControl className={classes.formControl}>
                  <InputLabel id={`role-label-${user.userId}`}>Name</InputLabel>
                  <Select
                    labelId={`role-label-${user.userId}`}
                    id={`role-sel-${user.userId}`}
                    value={Role.None}
                    onChange={(e) => handleRadioChange(e, user)}
                    inputProps={{ readOnly: user.userId == note.owner }}
                  >
                    <MenuItem value={Role.None}>None</MenuItem>
                    <MenuItem value={Role.Viewer}>Viewer</MenuItem>
                    <MenuItem value={Role.Editor}>Editor</MenuItem>

                  </Select>
                  {
                    (user.userId == note.owner) && (
                      <FormHelperText>You.</FormHelperText>
                    )
                  }
                </FormControl> */}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
    </Dialog>
  );
}