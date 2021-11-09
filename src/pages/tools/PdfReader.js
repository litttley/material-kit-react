import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Container, Grid } from '@mui/material';
import WebViewer from '@pdftron/webviewer';
import { connect } from 'react-redux';
import Page from '../../components/Page';
import PdfWebViewer from '../../components/PdfWebViewer';
import { hiddenAction, showAction } from '../../action';
import store from '../../store';

const useStyles = makeStyles((theme) => ({
  root: {
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(96, 96, 96, .3)',

    // color: 'wh33ite',
    height: '110%',
    padding: '0 0'
  },
  container: {
    height: '100%'
  }
}));
function PdfReader(props) {
  const { changeShowDis } = props;
  const classes = useStyles();
  const viewer = useRef();
  const [trueFalse, setTrueFalse] = useState(true);

  const changeShow = () => {
    console.log('redux clikc');
    const value = !trueFalse;
    changeShowDis(value);
    setTrueFalse(value);
  };
  /* css */
  return (
    <>
      <Page title="读书" className={classes.root}>
        <PdfWebViewer
          docOption={{ fileUrl: 'http://localhost:3000/static/111.pdf', fileName: '111.pdf' }}
          ref={viewer}
        />
      </Page>
    </>
  );
}

const mapStateToProps = (state) => {
  console.log('pdfReader mapStateToProps');
  console.log(state);
  return {
    newState: state
  };
};

const mapDispatchToProps = (dispatch) => {
  console.log(dispatch);
  return {
    changeShowDis: (flag) => {
      dispatch(hiddenAction(flag));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PdfReader);
