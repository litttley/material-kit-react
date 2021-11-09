import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Container, Grid } from '@mui/material';
import Page from '../../components/Page';
import TranslationComponent from '../../components/TranslatiomComponent';

export default function Translation(props) {
  /* css */
  return (
    <>
      <Page title="我的记事本">
        <Container>
          <TranslationComponent />
        </Container>
      </Page>
    </>
  );
}
