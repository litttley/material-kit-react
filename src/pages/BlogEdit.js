import {
  Button,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  TextField,
  Container,
  Grid,
  Typography
} from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import Page from '../components/Page';
import { EditorDemo } from '../utils/MdEditor';
import 'braft-editor/dist/index.css';
import '../css/markdown-override.css';

import CustomizedSnackbars from '../utils/CustomizedSnackbars';

const section = {
  height: '100%',
  paddingTop: 5,
  backgroundColor: 'red'
};

const useStyles = makeStyles((theme) => ({
  root: {
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(96, 96, 96, .3)',

    // color: 'white',
    height: '100%',
    padding: '0 30px'
  },
  button: {
    margin: '0px 20px',
    height: '100%'
  },
  textField: {
    height: '100%'
  },
  simpleMDGrid: {
    paddingBottom: '24px'
  }
}));

export default function BlogEdit() {
  console.log('BlogEdit');
  const { pathname, search, hash, state, key } = useLocation();
  console.log(state);
  const navigate = useNavigate();
  /* state */
  const [moudle, setMoudle] = useState('');
  const [content, setContent] = useState('');
  const [bid, setBid] = useState(state.bid);
  const [title, setTitle] = useState('');

  const [snackBarMessage, setsnackBarMessage] = useState({
    message: '',
    severity: 'success', // 可选:error warning info success
    anchorOrigin: {
      // 位置
      vertical: 'top',
      horizontal: 'center'
    }
  });
  const classes = useStyles();
  /* ref */
  const inputRef = React.useRef();
  const radioRef = React.useRef();
  const markdownContentRef = React.useRef();
  const snackRef = React.useRef();
  /* function */
  const getData = () => {
    axios
      .post('/api/geteditmkdown', {
        bid: `${bid}`
      })
      .then((response) => {
        console.log(response);
        if (response.data.code === 200) {
          // eslint-disable-next-line camelcase
          const { id, title, content, blog_moudle } = response.data.data;
          setBid(id);
          setTitle(title);
          setMoudle(blog_moudle);
          setContent(content);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    console.log('BlogEdit =>useEffect');
    getData();
  }, [bid]);
  const snackBarToasr = (ref, message) => {
    setsnackBarMessage(message);
    ref.current();
  };
  const submit = () => {
    /*  alert(moudle);
    alert(markdownContentRef.current());
    alert(inputRef.current.value); */
    console.log('console.log(inputRef);');
    console.log(inputRef);
    const dataValue = {
      blogid: '',
      userid: '',
      content: markdownContentRef.current(),
      content_html: '',
      title: inputRef.current.value,
      blog_moudle: moudle
    };

    axios
      .post('/api/blogsave', {
        ...dataValue
      })
      .then((response) => {
        console.log(response);
        if (response.data.code === 200) {
          snackBarToasr(snackRef, {
            message: '保存成功!',
            severity: 'success',
            anchorOrigin: {
              // 位置
              vertical: 'top',
              horizontal: 'center'
            }
          });
          setTimeout(() => navigate('/blog/list', { replace: true }), 3000);
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
        }
      })
      .catch((error) => {
        snackBarToasr(snackRef, {
          message: '保存失败!',
          severity: 'error',
          anchorOrigin: {
            // 位置
            vertical: 'top',
            horizontal: 'center'
          }
        });
      });
  };

  const radioChange = (event) => {
    setMoudle(event.target.value);
  };
  return (
    <>
      <Page title="添加笔记" className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <TextField
              value={title}
              inputRef={inputRef}
              id="standard-textarea"
              label="标题"
              placeholder="请输入笔记标题"
              className={classes.textField}
              fullWidth
              variant="standard"
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <Button onClick={submit} variant="outlined" color="primary" className={classes.button}>
              保存
            </Button>
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">选择分类</FormLabel>
              <RadioGroup row aria-label="position" name="position">
                <FormControlLabel
                  checked={moudle === 'rust'}
                  inputRef={radioRef}
                  value="rust"
                  control={<Radio color="primary" />}
                  label="rust"
                  labelPlacement="start"
                  onChange={radioChange}
                />
                <FormControlLabel
                  checked={moudle === 'java'}
                  inputRef={radioRef}
                  value="java"
                  control={<Radio color="primary" />}
                  label="java"
                  labelPlacement="start"
                  onChange={radioChange}
                />
                <FormControlLabel
                  checked={moudle === 'python'}
                  inputRef={radioRef}
                  value="python"
                  control={<Radio color="primary" />}
                  label="python"
                  labelPlacement="start"
                  onChange={radioChange}
                />
                <FormControlLabel
                  checked={moudle === 'linux'}
                  inputRef={radioRef}
                  value="linux"
                  control={<Radio color="primary" />}
                  label="linux"
                  labelPlacement="start"
                  onChange={radioChange}
                />
                <FormControlLabel
                  checked={moudle === 'sql'}
                  inputRef={radioRef}
                  value="sql"
                  control={<Radio color="primary" />}
                  label="sql"
                  labelPlacement="start"
                  onChange={radioChange}
                />
                <FormControlLabel
                  checked={moudle === 'other'}
                  inputRef={radioRef}
                  value="other"
                  control={<Radio color="primary" />}
                  label="other"
                  labelPlacement="start"
                  onChange={radioChange}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={12} className={classes.simpleMDGrid}>
            <EditorDemo markdownContentRef={markdownContentRef} content={content} />
          </Grid>
        </Grid>
      </Page>
      <CustomizedSnackbars snackBarMessage={snackBarMessage} ref={snackRef} />
    </>
  );
}
