import { Icon } from '@iconify/react';
import React, { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
import axios from 'axios';
import { sample } from 'lodash';
import CustomizedSnackbars from '../../../utils/CustomizedSnackbars';

// ----------------------------------------------------------------------

export default function UserMoreMenu(props) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const deleteClick = () => {
    axios
      .post('/api/blogdelete', {
        bid: `${props.id}`
      })
      .then((response) => {
        console.log(response);
        if (response.data.code === 200) {
          setTimeout(() => props.refresh(true), 1000);
        }
      })
      .catch((error) => {
        props.refresh(false);
      });
  };

  const editClick = () => {
    navigate('/blog/edit', { state: { bid: props.id } }, { replace: true });
  };

  const viewClick = () => {
    navigate('/blog/view', { state: { bid: props.id } }, { replace: true });
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={viewClick} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="查看" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem onClick={editClick} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="编辑" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="删除"
            primaryTypographyProps={{ variant: 'body2' }}
            onClick={deleteClick}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
