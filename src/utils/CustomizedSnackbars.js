import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState, useStyles, forwardRef } from 'react';

function CustomizedSnackbars(props, ref) {
  console.log('props  ref ===>');
  console.log(props);
  console.log(ref);
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  ref.current = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (
    <>
      <Snackbar
        anchorOrigin={props.snackBarMessage.anchorOrigin}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={props.snackBarMessage.severity}
        >
          {props.snackBarMessage.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
export default forwardRef(CustomizedSnackbars);
