import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Card, CardHeader, Divider, Grid } from '@material-ui/core';
import { Form, FormikProvider } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@material-ui/styles';

import axios from 'axios';
import { AppTasks } from './_dashboard/app';

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
  textAreaStyle: {
    width: '100%',
    border: 'none',
    resize: 'none',
    cursor: 'pointer',
    outline: 'none',
    fontSize: 24,
    autofocus: 'autofocus'
  }
}));
export default function TranslationComponent(props) {
  const classes = useStyles();
  const textArealeft = useRef();
  const [value, setValue] = useState('');
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('zh-CN');

  const [times, setTimes] = useState(1);
  const [translateValue, setTranslateValue] = useState('');
  const [translatePlaceholder, setTranslatePlaceholder] = useState('翻译');

  useEffect(() => {
    textArealeft.current.focus();
    console.log();
  }, []);

  const getTranslateSign = (value) => {
    const dealValue = value.replace(/\r\n/g, '').replace('\n', '');
    axios
      .post('/translate', {
        value: dealValue,
        from_lang: fromLang,
        to_lang: toLang,
        times
      })
      .then((response) => {
        if (response.data.code === 200) {
          if (response.data.msg === 'success') {
            const text = response.data.data;
            const d = text.indexOf('\n', 6);
            const e = text.substring(6, d);
            const f = Number(e);
            const c = text.substr(d, f);
            const valueJson = window.JSON.parse(c);
            const jsonStr1 = valueJson[0][2];
            const valueJson2 = window.JSON.parse(jsonStr1);
            const realValueArray = valueJson2[1][0][0][5];

            const realValue = realValueArray.map((item) => item[0]);
            setTranslateValue(realValue);
            setTimes(times + 1);
          } else {
            const text = response.data.data;
            setTranslateValue(text);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const onChange = (event) => {
    const val = event.target.value;

    setValue(val);

    if (val !== '') {
      setTranslatePlaceholder('正在翻译....');
      getTranslateSign(val);
    } else {
      setTranslateValue('');
      setTranslatePlaceholder('翻译');
    }

    console.log(event.target.value);
  };
  return (
    <>
      <Card>
        <CardHeader title="翻译" sx={{ backgroundColor: '' }} />
        <Divider />
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={1}
          padding={2}
        >
          <TextareaAutosize
            ref={textArealeft}
            minRows={20}
            className={classes.textAreaStyle}
            autofocus
            onChange={onChange}
          />
          <TextareaAutosize
            placeholder={translatePlaceholder}
            value={translateValue}
            className={classes.textAreaStyle}
            minRows={20}
            autofocus
          />
        </Stack>
      </Card>
    </>
  );
}
