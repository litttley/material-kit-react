import React, { useState, useEffect } from 'react';
import { Stack, Container, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import axios from 'axios';

import Page from '../components/Page';
import PageUtils from './tools/PageUtils';
import KlineDialog from './tools/KlineDialog';

function Stock(props) {
  const navigate = useNavigate();
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

  const snackBarToasr = (ref, message) => {
    setsnackBarMessage(message);
    ref.current();
  };

  const tableHead = [
    { id: 'title', label: '标题', alignRight: false },
    { id: 'fileMoudle', label: '模块', alignRight: false },
    { id: 'updatedTimes', label: '修改次数', alignRight: false },

    { id: 'visitTimes', label: '访问次数', alignRight: false },
    { id: 'updatedAt', label: '更新时间', alignRight: false },
    { id: 'kLine', label: 'k线图', alignRight: false }
  ];

  useEffect(() => {
    console.log('useEffect');
    getData();
  }, [page, rowsPerPage]);

  useEffect(() => {
    getData();
  }, [refrush]);
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

  return (
    <>
      <Page title="我的股票">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              股票列表
            </Typography>
          </Stack>

          <PageUtils tableHead={tableHead} userList={userList}>
            <KlineDialog />
          </PageUtils>
        </Container>
      </Page>
    </>
  );
}

export default Stock;
