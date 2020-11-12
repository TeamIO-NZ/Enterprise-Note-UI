import { Collapse, createStyles, makeStyles, Theme } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useEffect } from "react";
import { setInterval } from "timers";
import ConnectionService from "../services/ConnectionService";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }),
);

export default function ConnectionWarning() {
  const classes = useStyles();
  const [show, setShow] = React.useState(false);

  useEffect(() => {
    setInterval(() => {
      ConnectionService.get()
        .then(() => {
          if (show) {
            setShow(false);
          }
        })
        .catch(() => {
          if (!show) {
            setShow(true);
          }
        });
    }, 5000); // check five seconds
  });

  return (
    <div className={classes.root}>
      <Collapse in={show}>
      <Alert severity="error">Connection to backend lost, attempting to reconnect.</Alert>
      </Collapse>
    </div>
  )
}