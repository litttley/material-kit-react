import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { connect } from 'react-redux';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import DashboardNavbar from './dashboard/DashboardNavbar';
import DashboardSidebar from './dashboard/DashboardSidebar';
import { hiddenAction } from '../action';

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
  const [chipLabel, setChipLabel] = useState('展开');
  const [isDisplayDashboardNavbar, setIsDisplayDashboardNavbar] = useState(false);
  console.log(newState.isDisplay);
  const handleClick = () => {
    const value = chipLabel === '展 开' ? '收 起' : '展 开';
    setChipLabel(value);
  };
  return (
    <RootStyle>
      {chipLabel === '展 开' ? <DashboardNavbar onOpenSidebar={() => setOpen(true)} /> : ''}
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />

      <MainStyle style={{ paddingTop: chipLabel === '展 开' ? APP_BAR_MOBILE + 24 : 0 }}>
        <Divider>
          <Chip label={chipLabel} onClick={handleClick} />
        </Divider>
        <Outlet />
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
