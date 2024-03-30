// Board Details
import Container from '@mui/material/Container'
import AppBar from '../../Components/AppBar'
import Boardbar from '../Boards/BoardBar'
import BoardContent from '../Boards/BoardContent'
function Board() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar/>
      <Boardbar/>
      <BoardContent/>
    </Container>
  )
}

export default Board