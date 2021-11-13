import React, { useState, useEffect, useRef } from 'react';
import { Stack, Container, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import Page from '../components/Page';
import PageUtils from './tools/PageUtils';
import CustomizedSnackbars from '../utils/CustomizedSnackbars';

function Stock(props) {
  const [snackBarMessage, setsnackBarMessage] = useState({
    message: '',
    severity: 'success', // 可选:error warning info success
    anchorOrigin: {
      // 位置
      vertical: 'top',
      horizontal: 'center'
    }
  });

  return (
    <>
      <Page title="我的股票">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              股票列表
            </Typography>
          </Stack>

          <PageUtils />
        </Container>
      </Page>
    </>
  );
}

export default Stock;
