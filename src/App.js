// routes
import axios from 'axios';

import Router from './routes';

// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
// ----------------------------------------------------------------------

// axios.defaults.baseURL = 'http://42.194.189.204:80';
// axios.defaults.baseURL = 'http://localhost:80';

axios.defaults.baseURL = process.env.BASE_URL;
/* 允许跨域携带cookie */
axios.defaults.withCredentials = true;

export default function App() {
  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <BaseOptionChartStyle />
      <Router />
    </ThemeConfig>
  );
}
