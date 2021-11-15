import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import ReactEcharts from 'echarts-for-react';
import { makeStyles } from '@mui/styles';
import { getDate } from 'date-fns';
import axios from 'axios';
import CustomizedSnackbars from '../../utils/CustomizedSnackbars';

const useStyles = makeStyles((theme) => ({
  root: {}
}));

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
/* eslint-disable */
const upColor = '#ec0000';
const upBorderColor = '#8A0000';
const downColor = '#00da3c';
const downBorderColor = '#008F28';
// Each item: open，close，lowest，highest

/* eslint-disable */
export default function KlineDialog(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [option1, setOption1] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [values, setValues] = useState([]);
  const [closeDataArray, setCloseDataArray] = useState([]);
  const [codeName, setCodeName] = useState('');
  const [code, setCode] = useState('');
  // const [stockDataArray, setStockDataArray] = useState([]);
  const [xAxisData, setxAxisData] = useState([]);
  const { stockCode, viewPointX, viewPointY } = props;
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
    setCategoryData([]);
    setValues([]);
    getData(stockCode);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const calculate_mean = (array) => {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }
    let mean = sum / array.length;
    return mean.toFixed(2);
  };

  const calculateMA = (array, daysOfMad) => {
    const madArray = array.map((currentValue, index) => {
      return calculate_mean(array.slice(index, index + daysOfMad));
    });
    madArray.reverse();
    return madArray;
  };
  const option = {
    title: {
      text: '',
      left: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['日K线', 'MA5', 'MA10']
    },
    grid: {
      left: '6%',
      right: '6%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: categoryData,
      scale: true,
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      min: 'dataMin',
      max: 'dataMax'
    },
    yAxis: {
      type: 'value',
      scale: true,
      splitArea: {
        show: true
      }
    },
    dataZoom: [
      {
        type: 'inside',
        start: 50,
        end: 100,
        filterMode: 'filter'
      },
      {
        show: true,
        type: 'slider',
        top: '90%',
        start: 50,
        end: 100
      }
    ],
    series: [
      {
        name: '日K线',
        type: 'candlestick',
        data: values,
        itemStyle: {
          color: '#ffffff',
          color0: '#ffffff',
          borderColor: upColor,
          borderColor0: downColor
        },
        markPoint: {
          // itemStyle: {
          //   color: '#ec0000'
          // },

          // label: {
          //   formatter: function (param) {
          //     return param != null ? Math.round(param.value) + '' : '';
          //   }
          // },
          data: [
            {
              symbol: 'pin',
              symbolSize: 20,
              name: 'view',
              coord: [viewPointX, viewPointY],
              value: '',
              itemStyle: {
                color: '#ec0000'
              }
            },
            {
              name: '最大值',
              type: 'max',
              valueDim: 'highest'
            },
            {
              name: 'lowest value',
              type: 'min',
              valueDim: 'lowest'
            },
            {
              name: 'average value on close',
              type: 'average',
              valueDim: 'close'
            }
          ]
          // tooltip: {
          //   formatter: function (param) {
          //     return param.name + '<br>' + (param.data.coord || '');
          //   }
          // }
        },
        markLine: {
          //   symbol: ['none', 'none'],
          //   data: [
          //     [
          //       {
          //         name: 'from lowest to highest1',
          //         type: 'min',
          //         valueDim: 'lowest',
          //         symbol: 'circle',
          //         symbolSize: 10,
          //         label: {
          //           show: false
          //         },
          //         emphasis: {
          //           label: {
          //             show: false
          //           }
          //         }
          //       },
          //       {
          //         type: 'max',
          //         valueDim: 'highest',
          //         symbol: 'circle',
          //         symbolSize: 10,
          //         label: {
          //           show: false
          //         },
          //         emphasis: {
          //           label: {
          //             show: false
          //           }
          //         }
          //       }
          //     ],
          //     {
          //       name: 'min line on close',
          //       type: 'min',
          //       valueDim: 'close'
          //     },
          //     {
          //       name: 'max line on close',
          //       type: 'max',
          //       valueDim: 'close'
          //     }
          //   ]
        }
      },
      {
        name: 'MA5',
        type: 'line',
        data: calculateMA(closeDataArray, 5),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          // opacity: 0.5
          color: '#628cff',
          width: 0.5
        }
      },
      {
        name: 'MA10',
        type: 'line',
        data: calculateMA(closeDataArray, 10),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          //   opacity: 0.5
          color: '#e5b13c',
          width: 0.5
        }
      }
      // {
      //   name: 'MA20',
      //   type: 'line',
      //   data: calculateMA(20),
      //   smooth: true
      //   // lineStyle: {
      //   //   opacity: 0.5
      //   // }
      // },
      // {
      //   name: 'MA30',
      //   type: 'line',
      //   data: calculateMA(30),
      //   smooth: true
      //   // lineStyle: {
      //   //   opacity: 0.5
      //   // }
      // }
    ]
  };

  const getData = (stockCode) => {
    axios
      .post('/getStockDailyData', {
        stockCode: stockCode
      })
      .then((response) => {
        if (response.data.code === 200) {
          const dataArray = response.data.data;
          const categoryData = [];
          const values = [];
          const closeDataArray = [];
          const stockName = dataArray[0].codeName;
          const code = dataArray[0].code;
          dataArray.map((data) => {
            categoryData.push(data.date);
            closeDataArray.push(parseFloat(data.close));
            values.push([data.open, data.close, data.low, data.high]);
          });

          if (categoryData.length == 0) {
            snackBarToasr(snackRef, {
              message: '该股票数据不存在',
              severity: 'error',
              anchorOrigin: {
                // 位置
                vertical: 'top',
                horizontal: 'center'
              }
            });
          } else {
            // setStockDataArray(newArray);
            setCategoryData(categoryData);
            setValues(values);
            closeDataArray.reverse();
            setCloseDataArray(closeDataArray);
            setCodeName(stockName);
            setCode(code);
            setOpen(true);
          }
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

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        k线图
      </Button>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <Typography gutterBottom align="center" variant="subtitle1">
            {codeName + ' ' + code}{' '}
          </Typography>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <ReactEcharts option={option} theme="Imooc" style={{ width: 550 }} />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <CustomizedSnackbars snackBarMessage={snackBarMessage} ref={snackRef} />
    </>
  );
}
