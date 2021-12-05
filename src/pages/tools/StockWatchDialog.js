import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  FormControlLabel,
  TableContainer,
  Container,
  Typography,
  TextField,
  Switch,
  Box,
  TablePagination,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CustomizedSnackbars from '../../utils/CustomizedSnackbars';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5
      }
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff'
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600]
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
    }
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    })
  }
}));

const Item = styled('div')(({ theme }) => ({
  // width: theme.spacing(4),
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0.5, 1)
  }
}));

export default function StockWatchDialog(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id, refPrice, title, type, closed, prevPrice, dialogRef } = props;
  const [open, setOpen] = React.useState(false);
  const [inputPrice, setInputPrice] = React.useState(0.0);
  const [inputPercent, setInputPercent] = React.useState(0);
  const [inputPriceVaild, setInputPriceVaild] = React.useState(false);
  const [inputPercentVaild, setinputPercentVaild] = React.useState(false);
  const [finallValue, setFinallValue] = React.useState(0.0);
  const [closeStatus, setCloseStatus] = React.useState(closed);

  const [snackBarMessage, setsnackBarMessage] = useState({
    message: '',
    severity: 'success', // 可选:error warning info success
    anchorOrigin: {
      // 位置
      vertical: 'top',
      horizontal: 'center'
    }
  });

  const snackRef = React.useRef();
  /* function */
  const snackBarToasr = (ref, message) => {
    setsnackBarMessage(message);
    ref.current();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    changeStockWatchFlag();
    dialogRef();
  };
  const handleClose2 = () => {
    setOpen(false);
  };
  const changeStockWatchFlag = () => {
    // if (finallValue <= 0&& closed===closeStatus) {
    //   setOpen(false);
    //   snackBarToasr(snackRef, {
    //     message: '价格设置不能为空!',
    //     severity: 'error',
    //     anchorOrigin: {
    //       // 位置
    //       vertical: 'top',
    //       horizontal: 'center'
    //     }
    //   });
    //   return;
    // }
    axios
      .post('/stockWatch/update', {
        closeStatus, // 第几页
        id,
        type,
        price: finallValue <= 0 ? '' : `${finallValue}`
      })
      .then((response) => {
        console.log(response);
        if (response.data.code === 200 && response.data.msg === 'ok') {
          snackBarToasr(snackRef, {
            message: '操作成功',
            severity: 'success',
            anchorOrigin: {
              // 位置
              vertical: 'top',
              horizontal: 'center'
            }
          });
        } else {
          snackBarToasr(snackRef, {
            message: '操作失败',
            severity: 'error',
            anchorOrigin: {
              // 位置
              vertical: 'top',
              horizontal: 'center'
            }
          });
        }
      })
      .catch((error) => {
        if (
          error.response !== null &&
          error.response !== undefined &&
          error.response.status === 401
        ) {
          snackBarToasr(snackRef, {
            message: '密码过期请重新登录!',
            severity: 'error',
            anchorOrigin: {
              // 位置
              vertical: 'top',
              horizontal: 'center'
            }
          });
          setTimeout(() => navigate('/login', { replace: true }), 1000);
        }
      });
  };

  const priceOnChange = (event) => {
    const changePrice = event.target.value;
    const reg = new RegExp('^[0-9]+(.[0-9]{2})?$');
    if (!reg.test(changePrice)) {
      setInputPriceVaild(true);
    } else {
      setInputPriceVaild(false);
      setInputPrice(parseFloat(changePrice).toFixed(2));
      if (type === 1) {
        setFinallValue(
          parseFloat((parseFloat(changePrice).toFixed(2) * (inputPercent + 100)) / 100).toFixed(2)
        );
      } else {
        setFinallValue(
          parseFloat((parseFloat(changePrice).toFixed(2) * (-inputPercent + 100)) / 100).toFixed(2)
        );
      }
    }
  };

  const percentOnChange = (event) => {
    const changePercent = event.target.value;
    const reg = new RegExp('^[0-9]*$');
    if (!reg.test(changePercent)) {
      setinputPercentVaild(true);
    } else {
      setinputPercentVaild(false);
      setInputPercent(parseInt(changePercent, 10));
      if (type === 1) {
        setFinallValue(
          parseFloat((inputPrice * (parseInt(changePercent, 10) + 100)) / 100).toFixed(2)
        );
      } else {
        setFinallValue(
          parseFloat((inputPrice * (-parseInt(changePercent, 10) + 100)) / 100).toFixed(2)
        );
      }
    }
  };

  return (
    <>
      <Button variant="outlined" className={classes.root} onClick={handleClickOpen}>
        监听设置
      </Button>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose2}>
          <Typography gutterBottom align="center" variant="subtitle1">
            {title}
          </Typography>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Stack direction="row" alignItems="center">
            <Item>
              <Typography gutterBottom align="center" variant="body1">
                参考价格:{refPrice}
              </Typography>
            </Item>
            <Item>
              <Typography gutterBottom align="center" variant="body1">
                上次设置价格:{prevPrice}
              </Typography>
            </Item>
          </Stack>
          <Stack direction="row" alignItems="center">
            <Item>
              <Typography gutterBottom align="center" variant="body1">
                是否开启:
              </Typography>
            </Item>
            <Item>
              <FormControlLabel
                onChange={(event, checked) => {
                  setCloseStatus(checked ? 'O' : 'C');
                }}
                control={<IOSSwitch sx={{ m: 1 }} defaultChecked={closeStatus === 'O'} />}
                // checked={stockWatchFlag === '1'}
                label=""
              />
            </Item>
          </Stack>

          <Stack direction="row" alignItems="center">
            <Item>
              <Typography gutterBottom align="center" variant="body1">
                设置监听价格:
              </Typography>
            </Item>
            <Item>
              <TextField
                id="input-with-sx1"
                label="输入价格"
                variant="standard"
                error={inputPriceVaild}
                helperText="有效内容为两位小数的数字"
                onChange={priceOnChange}
              />
            </Item>
          </Stack>

          <Stack direction="row" alignItems="center">
            <Item>
              <Typography gutterBottom align="center" variant="body1">
                涨幅(百分比%):
              </Typography>
            </Item>
            <Item>
              <TextField
                error={inputPercentVaild}
                id="input-with-sx2"
                label="输入百分比"
                variant="standard"
                onChange={percentOnChange}
                helperText="有效内容为整正数"
              />
            </Item>
          </Stack>

          <Stack direction="row" alignItems="center">
            <Item>
              <Typography gutterBottom align="center" variant="body1" style={{ color: 'red' }}>
                最终价格:{finallValue}
              </Typography>
            </Item>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            保存
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <CustomizedSnackbars snackBarMessage={snackBarMessage} ref={snackRef} />
    </>
  );
}
