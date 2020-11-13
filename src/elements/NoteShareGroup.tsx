import { Avatar, Grid, Tooltip, Typography } from '@material-ui/core';
import { AvatarGroup } from '@material-ui/lab';
import React, { useEffect } from 'react';
import { JsxElement } from 'typescript';
import { Note } from '../models/Note';
import User from '../models/User';
import UserServices from '../services/UserServices';

export default function NoteShareGroup({note}: {note: Note}) {

  const [owner, setOwner] = React.useState<Array<User>>([]);
  const [editors, setEditors] = React.useState<Array<User>>([]);
  const [viewers, setViewers] = React.useState<Array<User>>([]);

  const genGroup = (users: Array<User>): any => {

    return (
      <AvatarGroup max={4}>
        <Avatar>FUCK</Avatar>
        {
          users.map((u: User) => {
            <Tooltip title={u.name}>
              <Avatar>{u.name.charAt(0).toUpperCase()}</Avatar>
            </Tooltip>
          })
        }
      </AvatarGroup>
    );
  }

  useEffect(() => {
    console.log(note);
    setOwner([]);
    setEditors([]);
    setViewers([]);

    UserServices.get(note.owner)
      .then(res => {
        console.log(res);
        if (res.data) {
          var userInfo = res.data;
          let o = owner;
          o.push(new User(userInfo.name, "", false, "", "", "", userInfo.userId));
          setOwner(o);
          console.log(o);
        }
      });

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

  }, [note]);

  return (
    <div>
      <Typography variant="body2">pog</Typography>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          {
            genGroup(owner)
          }
        </Grid>
        <Grid item xs={4}>
          {
            genGroup(editors)
          }
        </Grid>
        
        <Grid item xs={4}>
          {
            genGroup(viewers)
          }
        </Grid>
      </Grid>
    </div>
  );
};