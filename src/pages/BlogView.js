import { makeStyles } from '@material-ui/styles';
import SimpleMDE from 'react-simplemde-editor';
import React, { useEffect, useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Grid } from '@material-ui/core';
import Page from '../components/Page';
import { MdParse } from '../utils/MdParse';
import Label from '../components/Label';

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
    paddingBottom: '0px'
  },
  title: { width: '100%', color: '#808080' }
}));
export default function BlogView() {
  const { pathname, search, hash, state, key } = useLocation();

  /* state */
  const [moudle, setMoudle] = useState('');
  const [content, setContent] = useState('');
  const [bid, setBid] = useState(state.bid);
  const [title, setTitle] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  /* css */
  const classes = useStyles();
  const getData = () => {
    axios
      .post('/api/getmkdown', {
        bid: `${bid}`
      })
      .then((response) => {
        console.log(response);
        if (response.data.code === 200) {
          // eslint-disable-next-line camelcase
          const { id, title, content, blog_moudle, updatedAt } = response.data.data;
          setBid(id);
          setTitle(title);
          setMoudle(blog_moudle);
          setContent(content);
          setUpdatedAt(updatedAt);
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

  return (
    <>
      <Page title="查看笔记" className={classes.root}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h4" align="center">
              {title}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <Label>
              模块:{moudle}&nbsp;&nbsp;&nbsp;&nbsp; 更新时间:{updatedAt}
            </Label>
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <MdParse mdContent={content} />
          </Grid>
        </Grid>

        {/*
        uploadImage:打开复制或拽上传
        previewImagesInEditor:在编辑器中预览图片
        lineNumbers:编辑器右侧行数显示,默认为false
        lineWrapping:显示行数默认为true
        placeholder:背景提示文字，类似input的
        promptURLs:点击插入图片图标时会弹出一个输入框
        status:最下面的提示信息如行数 字数
        */}
        {/*  <SimpleMDE
          value=""
          options={{
            inputStyle: 'input',
            showIcons: ['strikethrough', 'code', 'table'],
            status: true,
            toolbar: true,
            toolbarTips: false,
            autofocus: false,
            uploadImage: true,
            previewImagesInEditor: true,
            lineNumbers: false,
            lineWrapping: true,
            placeholder: '1212',
            previewClass: '我是',
            promptURLs: true,
            RenderingOptions: {
              codeSyntaxHighlighting: true
            },
            sideBySideFullscreen: true,
            theme: '小小'
          }}
        /> */}

        {/* <SimpleMDE
          value=""
          options={{
            showIcons: [
              'strikethrough',
              'code',
              'table',
              'redo',
              'heading',
              'undo',
              'heading-bigger',
              'heading-smaller',
              'heading-1',
              'heading-2',
              'heading-3',
              'clean-block',
              'horizontal-rule'
            ],
            styleSelectedText: false,
            lineWrapping: false,
            previewRender: (plainText) => '<div>67676767</div>'
          }}
        /> */}
      </Page>
    </>
  );
}
