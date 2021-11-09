import { filter, sample } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import React, { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
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
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// components
import axios from 'axios';
import faker from 'faker';
import { makeStyles, useTheme } from '@material-ui/styles';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
import { mockImgAvatar } from '../utils/mockImages';
import CustomizedSnackbars from '../utils/CustomizedSnackbars';
//
// import USERLIST from '../_mocks_/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: '标题', alignRight: false },
  { id: 'fileMoudle', label: '模块', alignRight: false },
  { id: 'updatedTimes', label: '修改次数', alignRight: false },

  { id: 'visitTimes', label: '访问次数', alignRight: false },
  { id: 'updatedAt', label: '更新时间', alignRight: false }
];
const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5)
  }
}));
// ----------------------------------------------------------------------

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}
TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  const navigate = useNavigate();
  console.log('User');
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userList, setUserList] = useState([]);
  const [refrush, setRefrush] = useState(false);
  const [count, setCount] = useState(0);
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

  const getData = () => {
    axios
      .post('/bloglistcontent', {
        page, // 第几页
        rows_per_page: rowsPerPage,
        blogMoudle: ''
      })
      .then((response) => {
        console.log(response);
        if (response.data.code === 200) {
          const dataArray = response.data.data.blog_list;
          const { count } = response.data.data;
          const newArray = dataArray.map((data) => ({
            id: data.id,
            avatarUrl: '/static/mock-images/avatars/avatar_default.jpg',
            title: data.title,
            fileMoudle: data.blog_moudle,
            updatedTimes: data.updated_times,
            updatedAt: data.updated_at,
            visitTimes: data.visit_times
          }));
          setUserList(newArray);
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
  useEffect(() => {
    console.log('useEffect');
    getData();
  }, [page, rowsPerPage]);
  useEffect(() => {
    getData();
  }, [refrush]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const refresh = (type) => {
    if (type) {
      snackBarToasr(snackRef, {
        message: '保存成功!',
        severity: 'success',
        anchorOrigin: {
          // 位置
          vertical: 'top',
          horizontal: 'center'
        }
      });
      setRefrush((prevState) => !prevState);
    } else {
      snackBarToasr(snackRef, {
        message: '删除失败!',
        severity: 'error',
        anchorOrigin: {
          // 位置
          vertical: 'top',
          horizontal: 'center'
        }
      });
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userList.map((n) => n.name);
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
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // 每页行数
    setPage(0); // 页数
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length * rowsPerPage) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <>
      <Page title="我的笔记">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              笔记列表
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/index/blog/add"
              startIcon={<Icon icon={plusFill} />}
            >
              新建笔记
            </Button>
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
                    headLabel={TABLE_HEAD}
                    rowCount={userList.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers
                      // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const {
                          id,
                          title,
                          updatedTimes,
                          visitTimes,
                          fileMoudle,
                          avatarUrl,
                          updatedAt
                        } = row;
                        const isItemSelected = selected.indexOf(title) !== -1;

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
                                onChange={(event) => handleClick(event, title)}
                              />
                            </TableCell>
                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={title} src={avatarUrl} />
                                <Typography variant="subtitle2" noWrap>
                                  {title}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="left">{fileMoudle}</TableCell>
                            <TableCell align="left">{updatedTimes}</TableCell>
                            <TableCell align="left">{visitTimes}</TableCell>
                            <TableCell align="left">{updatedAt}</TableCell>

                            <TableCell align="right">
                              <UserMoreMenu id={id} refresh={refresh} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
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
              backIconButtonText="上一页"
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </Card>
        </Container>
      </Page>

      <CustomizedSnackbars snackBarMessage={snackBarMessage} ref={snackRef} />
    </>
  );
}
