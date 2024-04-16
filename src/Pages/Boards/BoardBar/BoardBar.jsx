import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import LinkIcon from '@mui/icons-material/Link'
import BoltIcon from '@mui/icons-material/Bolt'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root' :{
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}
function Boardbar({ board }) {
  return (
    <Box px={2} sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => ( theme.palette.mode === 'dark' ? '#34495e' : '#1976d2' ),
      borderBottom: '1px solid #eef2f1',
      '&::-webkit-scrollbar-track': {
        m: 2
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <Chip
            sx={MENU_STYLES}
            icon={<DashboardIcon />}
            label={capitalizeFirstLetter(board?.title)}
            onClick
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <Chip
            sx={MENU_STYLES}
            icon={<AddToDriveIcon />}
            label={capitalizeFirstLetter(board?.type)}
            onClick
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <Chip
            sx={MENU_STYLES}
            icon={<LinkIcon />}
            label="Add Link"
            onClick
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <Chip
            sx={MENU_STYLES}
            icon={<BoltIcon />}
            label="Get Started"
            onClick
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <Chip
            sx={MENU_STYLES}
            icon={<BookmarkAddIcon />}
            label="Add New Task"
            onClick
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon/>}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite</Button>
        <AvatarGroup
          max={4}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': {
                bgcolor: '#a4d0be'
              }
            }
          }}>
          <Tooltip title='nguyenquangdiep'>
            <Avatar
              alt="NguyenQuangDiep"
              src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg" />
          </Tooltip>
          <Tooltip title='PhamThanhLong'>
            <Avatar
              alt="PhamThanhLong"
              src="https://hoangphucphoto.com/wp-content/uploads/2023/08/jpeg-5.jpg" />
          </Tooltip>
          <Tooltip title='NguyenNgocAnh'>
            <Avatar
              alt=""
              src="https://hoangphucphoto.com/wp-content/uploads/2023/08/jpeg-3.jpg" />
          </Tooltip>
          <Tooltip title='PhanDinhPhung'>
            <Avatar
              alt="PhamThanhLong"
              src="https://hoangphucphoto.com/wp-content/uploads/2023/08/jpeg-dl.jpg" />
          </Tooltip>
          <Tooltip title='ManhThuongQuan'>
            <Avatar
              alt="PhamThanhLong"
              src="https://hoangphucphoto.com/wp-content/uploads/2023/08/jpeg-chinh.webp" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default Boardbar