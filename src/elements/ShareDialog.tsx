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
import UserSettingService from '../services/UserSettingService';

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
        marginRight: 250
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
  setNote: Function;
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
  const { onClose, open, note, setNote, requestRefresh } = props;
  const [users, setUsers] = React.useState<Array<{ userId: number, name: string, role: Role }>>([]);
  const isMounted = useIsMounted();
  const [refreshCauseImLazy, setRefreshCauseImLazy] = React.useState("fucking work m8");

  if (note.editors == null) {
    note.editors = [];
  }

  if (note.viewers == null) {
    note.viewers = [];
  }

  useEffect(() => {
    if (isMounted()) {
      UserServices.getAll()
        .then((res: any) => {
          console.log(res)
          if (isMounted()) {
            setUsers([]);
            let ul: Array<{ userId: number, name: string, role: Role }> = [];
            res.data.data.forEach((u: any) => {
              ul.push({
                name: u.name,
                userId: u.userId,
                role: getRole(u.userId)
              });
            });
            console.log(ul)
            setUsers(ul);
          }
        });
    }

  }, [note, refreshCauseImLazy]);

  const getRole = (uId: number): Role => {
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
    console.log(note)
    NoteServices.update(note.id, note, note.owner).then(() => {
      requestRefresh(String(Date.now()));
      onClose();
    });

  };

  const handleRadioChange = (e: React.ChangeEvent<{ name?: string | undefined, value: unknown }>, user: { userId: number, name: string, role: Role }) => {
    if (note.owner === user.userId) { return; }
    let ul: Array<{ userId: number, name: string, role: Role }> = Object.assign([], users);
    clearUserRoles(ul[ul.indexOf(user)]);
    if (e.target.value == Role.None) {
      ul[ul.indexOf(user)].role = Role.None
    } else if (e.target.value == Role.Viewer) {
      ul[ul.indexOf(user)].role = Role.Viewer
      note.viewers.push(user.userId);
    } else if (e.target.value == Role.Editor) {
      ul[ul.indexOf(user)].role = Role.Editor
      note.editors.push(user.userId);
    }
    setUsers(ul);
  }


  // Jank code >:) ~Joe
  const clearUserRoles = (user: { userId: number, name: string, role: Role }) => {
    note.viewers = note.viewers.filter(id => id !== user.userId); // filter userId out of viewers
    note.editors = note.editors.filter(id => id !== user.userId); // filter userId out of editors
  }

  const handleSavePreset = () => {
    UserSettingService.get(note.owner)
      .then((res) => {
        console.log(res)
        return res.data.code == 400;
      }).then((shouldCreate: boolean) => {
        if (shouldCreate) {
          UserSettingService.create({
            editors: note.editors,
            viewers: note.viewers,
            id: note.owner
          });
        } else {
          UserSettingService.update(note.owner, {
            editors: note.editors,
            viewers: note.viewers,
          })
        }
      })
  }

  const handleLoadPreset = () => {
    UserSettingService.get(note.owner)
      .then((res) => {
        console.log(res)
        if (res.data.code === 200) {

          if (res.data.data.editors == undefined) {
            res.data.data.editors = [];
          }
          if (res.data.data.viewers == undefined) {
            res.data.data.viewers = [];
          }
          let n = Object.assign({}, note);
          n.editors = res.data.data.editors;
          n.viewers = res.data.data.viewers;

          setNote(n);

          setRefreshCauseImLazy(String(Date.now()));
        }
      });
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="share-dialog-title" open={open}>
      <DialogTitle id="share-dialog-title">
        Share Note
        <Button className={classes.actions} onClick={() => handleSavePreset()}>Save Preset</Button>
        <Button onClick={() => handleLoadPreset()}>Load Preset</Button>
      </DialogTitle>
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