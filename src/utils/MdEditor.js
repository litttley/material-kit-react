import React, { useState, useMemo } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { Grid } from '@material-ui/core';
import marked from 'marked';
import hljs from 'highlight.js';
import CustomizedSnackbars from './CustomizedSnackbars';
import { MdParse } from './MdParse';

export const EditorDemo = (props) => {
  console.log('EditorDemo:');
  console.log(props);

  /*  const extraKeys =
    useMemo <
    KeyMap >
    (() => ({
      Up(cm) {
        cm.replaceSelection(' surprise. ');
      },
      Down(cm) {
        cm.replaceSelection(' surprise again! ');
      }
    })); */

  const snackRef = React.useRef();
  const [value, setValue] = useState(props.content);
  const [snackBarMessage, setsnackBarMessage] = useState({
    message: '',
    severity: 'success', // 可选:error warning info success
    anchorOrigin: {
      // 位置
      vertical: 'top',
      horizontal: 'center'
    }
  });

  marked.setOptions({
    renderer: new marked.Renderer(),
    highlight(code) {
      return hljs.highlightAuto(code).value;
    },
    gfm: true, // 允许 Git Hub标准的markdown.
    pedantic: false, // 不纠正原始模型任何的不良行为和错误（默认为false）
    sanitize: false, // 对输出进行过滤（清理），将忽略任何已经输入的html代码（标签）
    tables: true, // 允许支持表格语法（该选项要求 gfm 为true）
    breaks: false, // 允许回车换行（该选项要求 gfm 为true）
    smartLists: true, // 使用比原生markdown更时髦的列表
    smartypants: false // 使用更为时髦的标点
  });

  const snackBarToasr = (ref, message) => {
    setsnackBarMessage(message);
    ref.current();
  };
  // 上传成功响应
  const uploadComplete = (evt) => {
    // 服务断接收完文件返回的结果

    const data = JSON.parse(evt.target.responseText);
    if (data.success) {
      const imgUrl = `\n![image](/api/${data.url})\r\n`;
      setValue(value + imgUrl);
      //   CodeMirror.Doc.replaceSelection(' ![image](" + data.url + ")\\r\\n ');

      snackBarToasr(snackRef, {
        message: '图片上传成功!',
        severity: 'success',
        anchorOrigin: {
          // 位置
          vertical: 'top',
          horizontal: 'center'
        }
      });
    } else {
      snackBarToasr(snackRef, {
        message: '图片上传失败!',
        severity: 'error',
        anchorOrigin: {
          // 位置
          vertical: 'top',
          horizontal: 'center'
        }
      });
    }
  };

  // 上传失败
  const uploadFailed = () => {
    snackBarToasr(snackRef, {
      message: '图片上传失败!',
      severity: 'error',
      anchorOrigin: {
        // 位置
        vertical: 'top',
        horizontal: 'center'
      }
    });
  };

  const pasteEvent = (evt) => {
    console.log('patsteevent');
    const { clipboardData } = evt.nativeEvent;
    if (!(clipboardData && clipboardData.items)) return;

    // 判断图片类型的正则
    const isImage = /.jpg$|.jpeg$|.png$|.gif$/i;
    // eslint-disable-next-line no-plusplus
    for (let i = 0, { length } = clipboardData.items; i < length; i++) {
      const item = clipboardData.items[i];
      if (item.kind === 'file' && isImage.test(item.type)) {
        const img = item.getAsFile();
        // 服务器地址
        // var url='http://localhost/uploadimg?guid=1564673641404';
        const url = `/api/uploadimg?guid=1564673641404`;
        const formData = new FormData();
        // 将得到的图片文件添加到FormData
        formData.append('file', img);

        // 上传图片
        const xhr = new XMLHttpRequest();
        // 上传结束
        xhr.open('POST', url, true);
        xhr.onload = uploadComplete; // 请求完成
        xhr.onerror = uploadFailed; // 请求失败
        xhr.send(formData);
        // 当剪贴板里是图片时，禁止默认的粘贴
        return false;
      }
    }
  };
  const onChange = (value) => {
    setValue(value);
  };
  props.markdownContentRef.current = () => value;
  const userOptions = useMemo(
    () => ({
      autofocus: true,
      spellChecker: false,
      showIcons: ['code', 'table', 'clean-block', 'link'],
      previewRender: (plainText) => {
        console.log('previewRender');
        console.log('plainText');
        console.log(plainText);
        return marked(plainText);
      }
    }),

    []
  );
  return (
    <>
      <SimpleMDE
        onPaste={pasteEvent}
        value={props.content}
        onChange={onChange}
        options={userOptions}
      />
      <CustomizedSnackbars snackBarMessage={snackBarMessage} ref={snackRef} />
    </>
  );
};
