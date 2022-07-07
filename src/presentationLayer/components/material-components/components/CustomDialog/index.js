import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Alert from "@material-ui/lab/Alert/Alert";
import { CircularProgress } from "@material-ui/core";

const styles = (theme) => ({
  head: {
    margin: 0,
    padding: "32px 32px 10px",
  },
  typography: {
    textTransform: "none",
  },
  closeButton: {
    position: 'absolute',
    right: 21,
    top: 21,
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.head} {...other}>
      <Typography variant="h6" className={classes.typography}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: "25px 32px 32px",
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: 0,
  },
}))(MuiDialogActions);

export default function CustomDialog(props) {
  const { open, onClose, onExited, fullWidth, maxWidth, children, title, loading, error } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onExited={onExited}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      className="custom-modal"
    >
      <DialogTitle id="customized-dialog-title" onClose={onClose}>{title}</DialogTitle>
      <DialogContent>
        {error && <Alert className="custom-modal__error" severity="error">
          {error.message || error.title}
        </Alert>}
        {children}
      </DialogContent>
      {loading && <div className="abs-loader">
        <CircularProgress color="primary" />
      </div>}
      {/*<DialogActions>*/}
      {/*  <Button autoFocus onClick={onClose} color="primary">*/}
      {/*    Save changes*/}
      {/*  </Button>*/}
      {/*</DialogActions>*/}
    </Dialog>
  );
}