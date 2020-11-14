import { Avatar, createStyles, Grid, makeStyles, Theme, Tooltip, Typography } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { FormatListBulletedRounded } from '@material-ui/icons';
import { AvatarGroup } from '@material-ui/lab';
import React, { useEffect } from 'react';
import { useIsMounted } from 'react-tidy';
import { JsxElement } from 'typescript';
import { Note } from '../models/Note';
import User from '../models/User';
import UserServices from '../services/UserServices';

const useStyles = makeStyles((theme: Theme) => createStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
}))

export default function NoteShareGroup({ note }: { note: Note }) {
  const classes = useStyles();
  const [owner, setOwner] = React.useState<Array<User>>([]);
  const [editors, setEditors] = React.useState<Array<User>>([]);
  const [viewers, setViewers] = React.useState<Array<User>>([]);
  const isMounted = useIsMounted();

  const genGroup = (users: Array<User>): any => {
    if (users.length > 0) {
      console.log(`user:${users[0].name}`)
      return (

        <AvatarGroup max={4}>
          {
            users.map((u: User) => React.cloneElement(
              <Tooltip title={u.name}>
                <Avatar alt={u.name} className={classes.avatar}>{u.name.charAt(0).toUpperCase().toString()}</Avatar>
              </Tooltip>, {
              key: u.id
            }
            ))
          }
        </AvatarGroup>
      );
    }
    else {
      return null;
    }
  }

  useEffect(() => {
    //new User(userInfo.name, "", false, "", "", "", userInfo.userId, -1)

    UserServices.get(note.owner)
      .then(data => {
        console.log(data)
        var n: Array<User> = [];
        if (data === undefined || data === null) return [];
        //console.log(data.data) 
        var u = data.data;
        n.push(new User(u.name, "", false, "", "", "", u.userId, -1));

        return n;
      })
      .then(
        (users: Array<User>) => {
          setOwner(users);
        }
      )

    if (note.editors != null && note.editors.length > 0) {
      let e = Object.assign([], editors);
      setEditors([]);

      note.editors.forEach(id => {
        if (id !== 0) {
          UserServices.get(id)
            .then((res) => {
              if (isMounted()) {
                let user = res.data;
                e.push(new User(user.name, "", false, "", "", "", user.userId, -1));
                setEditors(e);
              }
            });
        }
      });
    }

    if (note.viewers != null && note.viewers.length > 0) {
      let v = Object.assign([], viewers);
      setViewers([]);

      note.viewers.forEach(id => {
        if (id !== 0) {
          UserServices.get(id)
            .then((res) => {
              if (isMounted()) {
                let user = res.data;
                v.push(new User(user.name, "", false, "", "", "", user.userId, -1));
                setViewers(v);
              }
            });
        }
      });
    }

  }, [note]);

  return (


    //grid container half
    <Grid container spacing={3} alignItems="stretch" justify="flex-start">
      <Grid item xs={3} sm={3}>
        <Typography >Owner</Typography>
        {
          genGroup(owner)
        }
      </Grid>
      <Grid item xs={3} sm={3}>
        <Typography >Editors</Typography>
        {
          genGroup(editors)
        }
      </Grid>
      <Grid item xs={3} sm={3}>
        <Typography >Viewer</Typography>
        {
          genGroup(viewers)
        }
      </Grid>
    </Grid>
  );
};