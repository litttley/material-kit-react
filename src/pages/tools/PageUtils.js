import React, { useState, useEffect } from 'react';

import { filter } from 'lodash';
import { DataGrid } from '@mui/x-data-grid';
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
  Switch,
  Box,
  TablePagination,
  Paper
} from '@mui/material';

import { height } from '@mui/system';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { UserListToolbar } from '../../components/_dashboard/user';
import UserListHead from './PageTableHead';
import Scrollbar from '../../components/Scrollbar';
import ViewEditToolBar from '../../components/ViewEditToolBar';
import SearchNotFound from '../../components/SearchNotFound';
import KlineDialog from './KlineDialog';
import CustomizedSnackbars from '../../utils/CustomizedSnackbars';

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

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)'
    }
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff'
      }
    }
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200
    })
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box'
  }
}));
const Item = styled('div')(({ theme }) => ({
  // width: theme.spacing(4),
  ...theme.typography.body2,
  // paddingLeft: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

function PageUtils(props) {
  const navigate = useNavigate();
  const tableHead = [
    { id: 'date', label: '日期', alignRight: false },
    { id: 'code_name', label: '股票名称', alignRight: false },
    { id: 'code', label: '股票编码', alignRight: false },
    { id: 'open', label: '开盘价', alignRight: false },
    { id: 'close', label: '收盘价', alignRight: false },
    { id: 'kLine', label: 'k线图', alignRight: false },
    { id: 'stockWatch', label: '加入监听列表', alignRight: false }
  ];
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [dataList, setDataList] = useState([]);
  const [refrush, setRefrush] = useState(false);
  const [count, setCount] = useState(0);
  const [stockWatchLabel, setStockWatchLabel] = useState('否');

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
  }, [refrush]);
  const getData = () => {
    axios
      .post('/stockList', {
        page, // 第几页
        rowsPerPage,
        searchValue: filterName
      })
      .then((response) => {
        console.log(response);
        if (response.data.code === 200) {
          const dataArray = response.data.data.remmond_list;
          const { count } = response.data.data;
          const newArray = dataArray.map((data) => ({
            id: data.id,
            date: data.date,
            code: data.code,
            codeName: data.codeName,
            open: data.open,
            close: data.close,
            high: data.high,
            stockWatchFlag: data.stockWatchFlag
          }));
          setDataList([]);
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

  const changeStockWatchFlag = (flag, refRecommendCodeId) => {
    axios
      .post('/stockWatch/save', {
        flag, // 第几页
        refRecommendCodeId
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
          setRefrush(!refrush);
        } else {
          snackBarToasr(snackRef, {
            message: response.data.msg,
            severity: 'error',
            anchorOrigin: {
              // 位置
              vertical: 'top',
              horizontal: 'center'
            }
          });
          setRefrush(!refrush);
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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const refreshPage = (type) => {
    if (type) {
      console.log(1);
    } else {
      console.log(1);
    }
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
  // 查询列表
  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    setPage(0);
  };

  const stockWatchChange = (flag, stockWatchId) => {
    // event.currentTarget.labels[0].innerText = checked ? '是' : '否';
    console.log(stockWatchId);
    changeStockWatchFlag(flag, stockWatchId);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataList.length) : 0;

  // const filteredUsers = applySortFilter(dataList, getComparator(order, orderBy), filterName);

  const isUserNotFound = dataList.length === 0;

  return (
    <>
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
                {dataList
                  //  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { id, date, codeName, code, open, close, high, stockWatchFlag } = row;
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
                        {/* <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={title} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {title}
                            </Typography>
                          </Stack>
                        </TableCell> */}
                        <TableCell align="left">{date}</TableCell>
                        <TableCell align="left">{codeName}</TableCell>
                        <TableCell align="left">{code}</TableCell>
                        <TableCell align="left">{open}</TableCell>
                        <TableCell align="left">{close}</TableCell>

                        <TableCell align="left">
                          <KlineDialog stockCode={code} viewPointX={date} viewPointY={high} />
                        </TableCell>
                        <TableCell align="left">
                          <FormControlLabel
                            onChange={(event, checked) => {
                              stockWatchChange(checked ? '1' : '0', id);
                            }}
                            control={
                              <IOSSwitch sx={{ m: 1 }} defaultChecked={stockWatchFlag === '1'} />
                            }
                            // checked={stockWatchFlag === '1'}
                            label={stockWatchFlag === '0' ? '否' : '是'}
                          />
                        </TableCell>
                        {/* <TableCell align="left">
                          <Stack direction="row" alignItems="center">
                            <Item>
                              <AntSwitch inputProps={{ 'aria-label': 'ant design' }} />
                            </Item>
                            <Item>
                              <TextField id="input-with-sx" label="With sx" variant="standard" />
                            </Item>
                            <Item>
                              <AntSwitch inputProps={{ 'aria-label': 'ant design' }} />
                            </Item>
                            <Item>
                              <TextField id="input-with-sx" label="With sx" variant="standard" />
                            </Item>
                          </Stack>
                        </TableCell> */}
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
    </>
  );
}
export default PageUtils;
