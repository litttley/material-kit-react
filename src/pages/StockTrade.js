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
import axios from 'axios';
import Page from '../components/Page';
import PageUtils from './tools/PageUtils';
import CustomizedSnackbars from '../utils/CustomizedSnackbars';
import { UserListToolbar } from '../components/_dashboard/user';
import Scrollbar from '../components/Scrollbar';
import UserListHead from './tools/PageTableHead';
import StockTradeDialog from './tools/StockTradeDialog';

import SearchNotFound from '../components/SearchNotFound';
import ViewEditToolBar from '../components/ViewEditToolBar';

function StockTrade(props) {
  const navigate = useNavigate();
  const tableHead = [
    { id: 'codeName', label: '股票名称', alignRight: false },
    { id: 'code', label: '股票编码', alignRight: false },
    { id: 'updateAt', label: '更新日期', alignRight: false },
    { id: 'sellPrice', label: '卖出价格', alignRight: false },
    { id: 'sellTrade', label: '卖出交易', alignRight: false },
    { id: 'buyPrice', label: '买入价格', alignRight: false },
    { id: 'buyTrade', label: '买入交易', alignRight: false }
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
  const [stockTradeLabel, setStockTradeLabel] = useState('否');
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
      .post('/stockTrade/list', {
        page, // 第几页
        rowsPerPage,
        searchValue: filterName
      })
      .then((response) => {
        console.log(response);
        if (response.data.code === 200) {
          const dataArray = response.data.data.stock_trade_list;
          const { count } = response.data.data;
          const newArray = dataArray.map((data) => ({
            id: data.id,
            updatedAt: data.updatedAt,
            code: data.code,
            codeName: data.codeName,
            buyPirce: data.buyPirce,
            sellPirce: data.sellPirce,
            buyClosed: data.buyClosed,
            sellClosed: data.sellClosed
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
  const isUserNotFound = dataList.length === 0;
  return (
    <>
      <Page title="股票交易">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              股票交易设置列表
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
                        buyPirce,
                        sellPirce,
                        buyClosed,
                        sellClosed,
                        refPrice
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
                          <TableCell align="left">{updatedAt}</TableCell>
                          <TableCell
                            align="left"
                            style={{ color: buyClosed === 'O' ? '#fb7600' : '#212B36' }}
                          >
                            {buyPirce}
                          </TableCell>

                          <TableCell align="left">
                            <StockTradeDialog
                              id={id}
                              refPrice={refPrice}
                              title="股票卖出设置"
                              type={1}
                              closed={buyClosed}
                              prevPrice={buyPirce}
                              dialogRef={dialogRef}
                            />
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ color: sellClosed === 'O' ? '#fb7600' : '#212B36' }}
                          >
                            {sellPirce}
                          </TableCell>
                          <TableCell align="left">
                            <StockTradeDialog
                              id={id}
                              refPrice={refPrice}
                              title="股票买入设置"
                              type={0}
                              closed={sellClosed}
                              prevPrice={sellPirce}
                              dialogRef={dialogRef}
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

export default StockTrade;
