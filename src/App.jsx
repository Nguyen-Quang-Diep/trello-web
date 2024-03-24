import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useColorScheme } from '@mui/material/styles'

//Function
function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  return (
    <Button
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light')
      }}
    >
      {mode === 'light' ? 'Turn dark' : 'Turn light'}
    </Button>
  )
}
// App
function App() {
  return (
    <>
      <ModeToggle/>
      <hr/>
      <Typography variant='body2' color='text.secondary'>Test Typography</Typography>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
    </>
  )
}
export default App
