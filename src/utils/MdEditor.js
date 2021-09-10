import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  const [value, setValue] = useState('');

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

  const pasteEvent = (evt) => {
    props.imagePast(evt);
  };
  const onChange = (value) => {
    // setValue(value);
    props.childValueChange(value);
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
