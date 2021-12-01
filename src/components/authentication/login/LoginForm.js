import * as Yup from 'yup';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

import axios from 'axios';
import CustomizedSnackbars from '../../../utils/CustomizedSnackbars';

export default function LoginForm() {
  const navigate = useNavigate();
  /* ref */
  const snackRef = React.useRef();
  /* state */
  const [showPassword, setShowPassword] = useState(false);
  const [snackBarMessage, setsnackBarMessage] = useState({
    message: '',
    severity: 'success', // 可选:error warning info success
    anchorOrigin: {
      // 位置
      vertical: 'top',
      horizontal: 'center'
    }
  });

  const LoginSchema = Yup.object().shape({
    // email: Yup.string().email('密码格式不正确').required('邮箱必填'),
    password: Yup.string().required('密码必填'),
    username: Yup.string().required('用户名密填')
  });
  /* function */

  const snackBarToasr = (ref, message) => {
    setsnackBarMessage(message);
    ref.current();
  };
  const updateSubmiting = (isSubmiting) => {
    formik.setSubmitting(isSubmiting);
  };

  const [wasm, setWasm] = useState();
  const loadWasm = async () => {
    try {
      // eslint-disable-next-line import/no-unresolved
      const wasms1 = await import('ly-blog-wasm');
      return wasms1;
    } catch (err) {
      console.error(`Unexpected error in loadWasm. [Message: ${err.message}]`);
    }
    return null;
  };

  useEffect(() => {
    const future = loadWasm();
    future.then((resp) => {
      if (resp !== null) {
        setWasm(resp);
      }
    });

    console.log('111');
  }, []);

  const onEnctypt = (formik) => {
    wasm.encrypt(formik.values.password).then((val) => {
      axios
        .post('/signin', {
          password: val,
          username: formik.values.username,
          remember: formik.values.remember
        })
        .then((response) => {
          console.log(response);
          if (response.data !== null && response.data !== undefined && response.data.code === 200) {
            snackBarToasr(snackRef, {
              message: '登录成功!',
              severity: 'success',
              anchorOrigin: {
                // 位置
                vertical: 'top',
                horizontal: 'center'
              }
            });
            setTimeout(() => navigate('/index/blog/list', { replace: true }), 1000);
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
            updateSubmiting(false);
          }
        })
        .catch((error) => {
          snackBarToasr(snackRef, {
            message: '注册失败!',
            severity: 'error',
            anchorOrigin: {
              // 位置
              vertical: 'top',
              horizontal: 'center'
            }
          });
        });
      updateSubmiting(false);
    });
  };

  const formik = useFormik({
    initialValues: {
      password: '',
      username: '',
      remember: true
    },
    validationSchema: LoginSchema,

    onSubmit: () => {
      onEnctypt(formik);
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              type="username"
              label="用户名"
              {...getFieldProps('username')}
              error={Boolean(touched.username && errors.username)}
              helperText={touched.username && errors.username}
            />

            {/*  <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="邮箱"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          /> */}

            <TextField
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label="密码"
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <FormControlLabel
              control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
              label="记住密码"
            />

            <Link component={RouterLink} variant="subtitle2" to="#">
              忘记密码?
            </Link>
          </Stack>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            登录
          </LoadingButton>
        </Form>
      </FormikProvider>
      <CustomizedSnackbars snackBarMessage={snackBarMessage} ref={snackRef} />
    </>
  );
}
