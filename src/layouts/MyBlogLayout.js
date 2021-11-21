import React, { useRef, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import { connect } from 'react-redux';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import DashboardNavbar from './dashboard/DashboardNavbar';
import DashboardSidebar from './dashboard/DashboardSidebar';
import { hiddenAction } from '../action';
import CustomizedSnackbars from '../utils/CustomizedSnackbars';
import ReactWebsocket from '../utils/ReactWebsocket ';

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

function MyBlogLayout(props) {
  console.log('MyBlogLayout');

  const { newState } = props;
  const [open, setOpen] = useState(false);
  const [chipLabel, setChipLabel] = useState(true);
  const [isDisplayDashboardNavbar, setIsDisplayDashboardNavbar] = useState(false);
  const [wbSocketClosed, setWebSocketClosed] = useState(true);
  console.log(newState.isDisplay);
  const handleClick = () => {
    const value = !chipLabel;
    setChipLabel(value);
  };

  // 消息提示
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

  // websocket

  const [wsUrl, setWsUrl] = useState('ws://localhost/ws/');

  const wsOnMessage = (data) => {
    console.log('实时提醒消息');
    snackBarToasr(snackRef, {
      message: data,
      severity: 'success',
      anchorOrigin: {
        // 位置
        vertical: 'bottom',
        horizontal: 'right'
      }
    });
  };

  const wsOnOpen = (value) => {
    console.log('wsOnOpen');
  };
  const wsOnClose = (value) => {
    console.log('wsOnClose');
  };
  let refWebSocket = React.useRef();
  const beforeunload = (event) => {
    setWebSocketClosed(false);
  };
  // 关闭浏览器事件
  window.removeEventListener('beforeunload', beforeunload);
  // 刷新浏览器事件
  window.addEventListener('beforeunload', beforeunload);
  return (
    <RootStyle>
      {chipLabel ? <DashboardNavbar onOpenSidebar={() => setOpen(true)} /> : ''}
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />

      <MainStyle style={{ paddingTop: chipLabel ? APP_BAR_MOBILE + 24 : 0 }}>
        <Divider>
          <Chip label={chipLabel ? '收 起' : '展 开'} onClick={handleClick} />
        </Divider>
        <Outlet />
        <CustomizedSnackbars snackBarMessage={snackBarMessage} ref={snackRef} />
        {wbSocketClosed ? (
          <ReactWebsocket
            url={wsUrl}
            onMessage={wsOnMessage} // 接受信息的回调
            onOpen={wsOnOpen} // websocket打开
            onClose={wsOnClose} // websocket关闭
            reconnect
            debug
            ref={(Websocket) => {
              refWebSocket = Websocket;
            }}
          />
        ) : (
          ''
        )}
      </MainStyle>
    </RootStyle>
  );
}

const mapStateToProps = (state) => {
  console.log('layout mapStateToProps');
  console.log(state);
  console.log(state);
  return {
    newState: { ...state }
  };
};

const mapDispatchToProps = (dispatch) => {
  console.log(dispatch);
  return {
    hidden: () => {
      dispatch(hiddenAction(false));
    }
    /*  delRecord(index) {
      dispatch(delRecord(index));
    } */
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MyBlogLayout);
