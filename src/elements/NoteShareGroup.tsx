import { Avatar, Grid, Tooltip, Typography } from '@material-ui/core';
import { FormatListBulletedRounded } from '@material-ui/icons';
import { AvatarGroup } from '@material-ui/lab';
import React, { useEffect } from 'react';
import { JsxElement } from 'typescript';
import { Note } from '../models/Note';
import User from '../models/User';
import UserServices from '../services/UserServices';

export default function NoteShareGroup({ note }: { note: Note }) {

  const [owner, setOwner] = React.useState<Array<User>>([]);
  const [editors, setEditors] = React.useState<Array<User>>([]);
  const [viewers, setViewers] = React.useState<Array<User>>([]);

  const genGroup = (users: Array<User>): any => {
    if (users.length > 0) {
      console.log(`user:${users[0].name}`)
      return (

        <AvatarGroup max={4}>
          {
            users.map((u: User) => React.cloneElement(
              <Tooltip title={u.name}>
                <Avatar alt={u.name}>{u.name.charAt(0).toUpperCase().toString()}</Avatar>
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
    UserServices.get(note.owner)
      .then(data => {
        console.log(data)
        var n: Array<User> = [];
        if (data === undefined || data === null) return [];
        //console.log(data.data) 
        var u = data.data;
        n.push(new User(u.name, "", false, "", "", "", u.userId));

        return n;
      })
      .then(
        (users: Array<User>) => {
          setOwner(users);
        }
      )
    if (note.editors != null) {
      if (note.editors.length > 0) {
        for (const id of note.editors) {
          UserServices.get(id)
            .then(res => {
              if (res.data.data) {
                var userInfo = res.data.data;
                let e = editors;
                e.push(new User(userInfo.name, "", false, "", "", "", userInfo.userId));
                setEditors(e);
                console.log(e);
              }
            });
        }
      }
    }
    if (note.viewers != null) {
      if (note.viewers.length > 0) {
        for (const id of note.viewers) {
          UserServices.get(id)
            .then(res => {
              if (res.data.data) {
                var userInfo = res.data.data;
                let v = viewers;
                v.push(new User(userInfo.name, "", false, "", "", "", userInfo.userId));
                setViewers(v);
                console.log(v);
              }
            });
        }
      }
    }

  }, [note]);

  return (
    <Grid item xs={12}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={2}>
          <Typography >Owner</Typography>
        </Grid>
        <Grid item xs={1}>
          {
            genGroup(owner)
          }
        </Grid>
        <Grid xs={1}></Grid>
        <Grid item xs={1} md={2}>
          <Typography >Editors</Typography>
        </Grid>
        <Grid item xs={3} md={2}>
          {
            genGroup(editors)
          }
        </Grid>
        <Grid item xs={1} md={2}>
          <Typography >Viewers</Typography>
        </Grid>
        <Grid item xs={3} md={2}>
          {
            genGroup(viewers)
          }
        </Grid>
      </Grid>
    </Grid>
  );
};