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
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Page from '../components/Page';
import EditorDemo from '../utils/MdEditor';
import 'braft-editor/dist/index.css';

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
  }
}));

export default function BlogAdd() {
  const [title, setTitle] = useState('');
  const [moudle, setMoudle] = useState('');

  const classes = useStyles();
  const inputRef = React.useRef();
  const radioRef = React.useRef();
  const markdownContentRef = React.useRef();

  const submit = () => {
    alert(`clicked${inputRef.current.value}`);

    alert(moudle);
    alert(markdownContentRef.current());
  };
  const radioChange = (event) => {
    setMoudle(event.target.value);
  };
  return (
    <Page title="添加笔记" className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={9} sm={9} md={9}>
          <TextField
            inputRef={inputRef}
            id="standard-textarea"
            label="标题"
            placeholder="请输入笔记标题"
            className={classes.textField}
            fullWidth
            variant="standard"
          />
        </Grid>

        <Grid item xs={3} sm={3} md={3}>
          <Button onClick={submit} variant="outlined" color="primary" className={classes.button}>
            保存
          </Button>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">选择分类</FormLabel>
            <RadioGroup row aria-label="position" name="position">
              <FormControlLabel
                inputRef={radioRef}
                value="rust"
                control={<Radio color="primary" />}
                label="rust"
                labelPlacement="rust"
                onChange={radioChange}
              />
              <FormControlLabel
                inputRef={radioRef}
                value="java"
                control={<Radio color="primary" />}
                label="java"
                labelPlacement="java"
                onChange={radioChange}
              />
              <FormControlLabel
                inputRef={radioRef}
                value="sql"
                control={<Radio color="primary" />}
                label="sql"
                labelPlacement="sql"
                onChange={radioChange}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

      <EditorDemo contentRef={markdownContentRef} />
    </Page>
  );
}
