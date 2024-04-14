import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'

function BoardContent() {

  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardContentHeight,
      bgcolor: (theme) => ( theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0' ),
      p: '10px 0'
    }}>
      <ListColumns/>
    </Box>
  )
}
export default BoardContent