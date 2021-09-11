import * as Yup from 'yup';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CustomizedSnackbars from '../../../utils/CustomizedSnackbars';
// ----------------------------------------------------------------------

export default function RegisterForm() {
  // const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  const timeState = useState(3);
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
  const snackRef = React.useRef();

  const RegisterSchema = Yup.object().shape({
    username: Yup.string().min(2, '用户名太短！').max(50, '用户名太长').required('用户名必填'),
    email: Yup.string().email('请输入有效的邮箱格').required('邮箱必填'),
    password: Yup.string().required('密码必填')
  });
  const snackBarToasr = (ref, message) => {
    setsnackBarMessage(message);
    ref.current();
  };
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirm_password: ''
    },
    validationSchema: RegisterSchema,

    onSubmit: () => {
      axios
        .post('/signup', {
          ...formik.values
        })
        .then((response) => {
          console.log(response);
          if (response.data.code === 200) {
            snackBarToasr(snackRef, {
              message: '注册成功了!',
              severity: 'success',
              anchorOrigin: {
                // 位置
                vertical: 'top',
                horizontal: 'center'
              }
            });
            setTimeout(() => navigate('/login', { replace: true }), 1000);
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
    }
  });

  const updateSubmiting = (isSubmiting) => {
    formik.setSubmitting(isSubmiting);
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  console.log(`isSubmitting${isSubmitting}`);

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="用户名"
                {...getFieldProps('username')}
                error={Boolean(touched.username && errors.username)}
                helperText={touched.username && errors.username}
              />
            </Stack>

            <TextField
              fullWidth
              autoComplete="email"
              type="email"
              label="邮箱"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label="密码"
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />

            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="确认密码"
              {...getFieldProps('confirm_password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.confirm_password && errors.confirm_password)}
              helperText={touched.confirm_password && errors.confirm_password}
            />

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              注册
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
      <CustomizedSnackbars snackBarMessage={snackBarMessage} ref={snackRef} />

      {/*      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="success">
          注册成功
        </MuiAlert>
      </Snackbar> */}
    </>
  );
}
