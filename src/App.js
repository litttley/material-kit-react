// routes
import axios from 'axios';

import Router from './routes';

// theme
import ThemeConfig from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
// ----------------------------------------------------------------------
axios.defaults.baseURL = 'http://localhost:3000';
// axios.defaults.baseURL = 'http://192.168.1.105:3000';
/* 允许跨域携带cookie */
axios.defaults.withCredentials = true;

export default function App() {
  return (
    <ThemeConfig>
      <ScrollToTop />
      <Router />
    </ThemeConfig>
  );
}
