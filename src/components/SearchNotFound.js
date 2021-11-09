import PropTypes from 'prop-types';
// material
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        没有数据
      </Typography>
      <Typography variant="body2" align="center">
        没有要查询的数据
        <strong>{searchQuery}</strong>请重新查询...
      </Typography>
    </Paper>
  );
}
