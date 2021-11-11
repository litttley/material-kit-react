import { Stack, Container, Typography } from '@mui/material';
import Page from '../components/Page';
import PageUtils from './tools/PageUtils';

function Stock(props) {
  const columns = [
    { field: 'id', headerName: '序号' },
    { field: 'firstName', headerName: '股票名称' },
    { field: 'lastName', headerName: '创建时间' },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number'
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      valueGetter: (params) =>
        `${params.getValue(params.id, 'firstName') || ''} ${
          params.getValue(params.id, 'lastName') || ''
        }`
    }
  ];

  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
  ];
  return (
    <>
      <Page title="我的股票">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              股票列表
            </Typography>
          </Stack>
          <PageUtils columns={columns} rows={rows} />
        </Container>
      </Page>
    </>
  );
}

export default Stock;
