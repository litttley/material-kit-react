import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  Switch,
  Box,
  TablePagination,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Page from '../components/Page';
import PageUtils from './tools/PageUtils';
import CustomizedSnackbars from '../utils/CustomizedSnackbars';
import { UserListToolbar } from '../components/_dashboard/user';
import Scrollbar from '../components/Scrollbar';
import UserListHead from './tools/PageTableHead';
import StockWatchDialog from './tools/StockWatchDialog';

import SearchNotFound from '../components/SearchNotFound';
import ViewEditToolBar from '../components/ViewEditToolBar';

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
function StockWatch(props) {
  const navigate = useNavigate();
  const tableHead = [
    { id: 'codeName', label: '股票名称', alignRight: false },
    { id: 'code', label: '股票编码', alignRight: false },
    { id: 'refClose', label: '参考价', alignRight: false },
    { id: 'updateAt', label: '更新日期', alignRight: false },
    { id: 'upPrice', label: '涨幅价格', alignRight: false },
    { id: 'upWatch', label: '涨幅监听', alignRight: false },
    { id: 'lowPrice', label: '跌幅价格', alignRight: false },
    { id: 'lowWatch', label: '跌幅监听', alignRight: false },
    { id: 'addTrade', label: '是否交易', alignRight: false }
  ];
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [dataList, setDataList] = useState([]);
  const [refrush, setRefrush] = useState(false);
  const [refrush2, setRefrush2] = useState(0);
  const [count, setCount] = useState(0);
  const [stockWatchLabel, setStockWatchLabel] = useState('否');
  // const dialogRef = React.useRef();
  const dialogRef = () => {
    let value = refrush2;

    setRefrush2(Object.assign((value += 1)));
  };

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

  useEffect(() => {
    console.log('useEffect');
    getData();
  }, [page, rowsPerPage, filterName]);

  useEffect(() => {
    getData();
  }, [refrush, refrush2]);
  const getData = () => {
    axios
      .post('/stockWatch/list', {
        page, // 第几页
        rowsPerPage,
        searchValue: filterName
      })
      .then((response) => {
        console.log(response);
        if (response.data.code === 200) {
          const dataArray = response.data.data.stock_watch_list;
          const { count } = response.data;
          const newArray = dataArray.map((data) => ({
            id: data.id,
            updatedAt: data.updatedAt,
            code: data.code,
            codeName: data.codeName,
            upPirce: data.upPirce,
            lowPirce: data.lowPirce,
            upClosed: data.upClosed,
            lowClosed: data.lowClosed,
            refPrice: data.refPrice,
            stockTradeFlag: data.tradeClosed
          }));
          setDataList(newArray);
          setCount(count);
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

  const changeStockTradeFlag = (flag, refStcokWatchId) => {
    axios
      .post('/stockTrade/save', {
        flag, // 第几页
        refStockWatchCodeId: refStcokWatchId
      })
      .then((response) => {
        console.log(response);
        if (response.data.code === 200 && response.data.msg === 'ok') {
          getData();
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

  const refreshPage = (type) => {
    if (type) {
      console.log(1);
    } else {
      console.log(1);
    }
  };

  // 查询列表
  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = dataList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setDataList([]);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // 每页行数
    setPage(0); // 页数
    setDataList([]);
  };

  const stockTradeChange = (flag, stockWatchId) => {
    // event.currentTarget.labels[0].innerText = checked ? '是' : '否';
    console.log(stockWatchId);
    changeStockTradeFlag(flag, stockWatchId);
  };
  const isUserNotFound = dataList.length === 0;
  return (
    <>
      <Page title="股票监听">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              股票监听列表
            </Typography>
          </Stack>

          <Card>
            <UserListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={tableHead}
                    rowCount={dataList.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {dataList.map((row) => {
                      const {
                        id,
                        updatedAt,
                        codeName,
                        code,
                        upPirce,
                        lowPirce,
                        upClosed,
                        lowClosed,
                        refPrice,
                        stockTradeFlag
                      } = row;
                      const isItemSelected = selected.indexOf(id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, id)}
                            />
                          </TableCell>
                          <TableCell align="left">{codeName}</TableCell>
                          <TableCell align="left">{code}</TableCell>
                          <TableCell align="left">{refPrice}</TableCell>
                          <TableCell align="left">{updatedAt}</TableCell>
                          <TableCell
                            align="left"
                            style={{ color: upClosed === 'O' ? '#fb7600' : '#212B36' }}
                          >
                            {upPirce}
                          </TableCell>

                          <TableCell align="left">
                            <StockWatchDialog
                              id={id}
                              refPrice={refPrice}
                              title="涨幅监听设置"
                              type={1}
                              closed={upClosed}
                              prevPrice={upPirce}
                              dialogRef={dialogRef}
                            />
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ color: lowClosed === 'O' ? '#fb7600' : '#212B36' }}
                          >
                            {lowPirce}
                          </TableCell>
                          <TableCell align="left">
                            <StockWatchDialog
                              id={id}
                              refPrice={refPrice}
                              title="跌幅监听设置"
                              type={0}
                              closed={lowClosed}
                              prevPrice={lowPirce}
                              dialogRef={dialogRef}
                            />
                          </TableCell>
                          <TableCell align="left">
                            <FormControlLabel
                              onChange={(event, checked) => {
                                stockTradeChange(checked ? '1' : '0', id);
                              }}
                              control={
                                <IOSSwitch sx={{ m: 1 }} defaultChecked={stockTradeFlag === '1'} />
                              }
                              // checked={stockWatchFlag === '1'}
                              label={stockTradeFlag === '0' ? '否' : '是'}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <ViewEditToolBar id={id} refresh={refreshPage} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  {isUserNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              labelRowsPerPage="显示条数"
              labelDisplayedRows={({ from, to, count }) => `${from}至${to}共${count}`}
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={count}
              rowsPerPage={rowsPerPage}
              page={page}
              // backiconbuttontext="上一页"
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
          <CustomizedSnackbars snackBarMessage={snackBarMessage} ref={snackRef} />
        </Container>
      </Page>
    </>
  );
}

export default StockWatch;
