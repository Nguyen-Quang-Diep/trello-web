import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Columns from './Column/Columns'
import AddIcon from '@mui/icons-material/Add'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

function ListColumns({ columns }) {
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      {/**The <SortableContext> component requires that you pass it the sorted array of the unique identifiers associated to each sortable item via the items prop. This array should look like ["1", "2", "3"], not [{id: "1"}, {id: "2}, {id: "3}]. */}
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': {
            m: 2
          }
        }}
      >
        {columns?.map((column) => (<Columns key={column._id} column={column} />))}

        <Box sx={{
          minWidth: '200px',
          maxWidth: '200px',
          mx: 2,
          borderRadius: '6px',
          height: 'fit-content',
          bgcolor: '#ffffff3d'
        }}
        >
          <Button startIcon={<AddIcon/>}
            sx={{
              color: 'white',
              width: '100%',
              justifyContent: 'flex-start',
              pl: 2.5,
              py: 1
            }} >Add New Column</Button>
        </Box>
      </Box>
    </SortableContext>
  )
}

export default ListColumns