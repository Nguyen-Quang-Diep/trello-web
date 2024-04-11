import ModeSelect from '~/Components/ModeSelect'
import Box from '@mui/material/Box'
import AppIcon from '@mui/icons-material/AppsRounded'
import { ReactComponent as TrelloIcon } from '~/Assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import WorkSpaces from './Menus/WorkSpaces'
import Recent from './Menus/Recent'
import Started from './Menus/Started'
import Templates from './Menus/Templates'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import InfoIcon from '@mui/icons-material/Info'
import Profile from './Menus/Profile'
function AppBar() {
  return (
    <Box px={2} sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      overflow: 'auto'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
        <AppIcon sx={{ color: 'primary.main' }}/>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <SvgIcon component={TrelloIcon} inheritViewBox sx={{ color: 'primary.main' }}/>
          <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'primary.main' }}
          >Trello</Typography>
        </Box>
        <Box sx={{ display: { xs:'none', md: 'flex' }, gap: 1 }}>
          <WorkSpaces />
          <Recent/>
          <Started/>
          <Templates/>
          <Button variant="contained">Create</Button>
        </Box>
      </Box>


      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField id="outlined-search" label="Search..." type="search" size='small' sx={{ minWidth: '120px' }} />
        <ModeSelect/>
        <Tooltip title="Notifications">
          <Badge color='secondary' variant='dot' sx={{ cursor: 'pointer' }}>
            <NotificationsNoneIcon sx={{ color: 'primary.main' }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <Badge color='secondary' variant='dot' sx={{ cursor: 'pointer' }}>
            <InfoIcon sx={{ color: 'primary.main' }}/>
          </Badge>
        </Tooltip>
        <Profile/>
      </Box>
    </Box>
  )
}
export default AppBar