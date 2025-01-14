import React, { useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import GroupIcon from '@material-ui/icons/Group';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { makeStyles } from '@material-ui/core/styles';

import Dialog, { DialogTitle, DialogContent, DialogActions, DialogContentText } from 'components/commons/Dialog';
import Fade from 'components/commons/Fade';
import { AppState } from 'app/rootReducer';
import { DocStatus } from 'features/docSlices';

const useStyles = makeStyles(() => ({
  dialog: {
    borderRadius: '4px',
  },
  input: {
    width: '300px',
    padding: '12px 8px',
    fontSize: '18px',
    borderRadius: '5px',
    outline: 'none',
    backgroundColor: 'hsla(0,0%,100%,0.9)',
  },
  box: {
    '@media only screen and (max-width: 600px)': {
      display: 'none',
    },
  },
  button: {
    lineHeight: '32px',
  },
}));

export default function ShareButton() {
  const classes = useStyles();
  const status = useSelector((state: AppState) => state.docState.status);
  const [open, setOpen] = useState(false);
  const [showCopyText, setShowCopyText] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const copyUrl = window.location.href.split('?')[0];

  const onFocus = useCallback(() => {
    inputRef.current?.select();
  }, []);

  const onCopy = useCallback(() => {
    setShowCopyText(true);
  }, []);

  const openModal = useCallback(() => {
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <div className={classes.box}>
      <Button
        className={classes.button}
        size="small"
        color="primary"
        variant="contained"
        startIcon={<GroupIcon />}
        onClick={openModal}
        disabled={status === DocStatus.Disconnect}
      >
        Share
      </Button>
      <Dialog open={open} onClose={closeModal} className={classes.dialog}>
        <DialogTitle onClose={closeModal}>Share Code</DialogTitle>
        <DialogContent dividers>
          <Box my={3}>
            <Typography>Anyone can access the code in real time through this URL.</Typography>
          </Box>
          <Box my={1}>
            <DialogContentText>Share this URL</DialogContentText>
          </Box>
          <Box display="flex">
            <input readOnly ref={inputRef} className={classes.input} value={copyUrl} onFocus={onFocus} />
            <CopyToClipboard text={copyUrl} onCopy={onCopy}>
              <IconButton color="primary">
                <FileCopyIcon />
              </IconButton>
            </CopyToClipboard>
            <Fade show={showCopyText} onFadeout={() => setShowCopyText(false)}>
              <p>Copy!</p>
            </Fade>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary" variant="contained" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
