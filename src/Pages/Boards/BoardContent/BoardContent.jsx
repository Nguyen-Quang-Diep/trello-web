import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext, PointerSensor, useSensor, useSensors, MouseSensor, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Columns from './ListColumns/Column/Columns'
import Card from './ListColumns/Column/ListCards/Card/Card'


const ACITVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACITVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACITVE_DRAG_ITEM_TYPE_CARD'
}
function BoardContent({ board }) {
  // https://docs.dndkit.com/api-documentation/sensors
  // neu su dung PointerSensors mac dinh thi phai ket hop thuoc tinh CSS touch-action: none o nhung phan tu keo tha
  //nhung ma con bug
  // const pointerSensor = useSensor( PointerSensor, { activationConstraint: { distance: 10 } })
  // Yeu cau chuot di chuyen 10px thi moi kich hoat event, fix truong hop click bi goi event

  const mouseSensor = useSensor( MouseSensor, { activationConstraint: { distance: 10 } })

  // Nhan giu 250ms va dung sai cua cam ung (de hieu la di chuyen / chenh lech 5px) thi moi kich hoat
  const touchSensor = useSensor( TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // Uu tien su dung ket hop 2 loai sensors la mouse va touch de co trai nghiem tot nhat tren mobile, khong bi bug.
  // const sensors = useSensors(pointerSensors)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [oderedColumnsState, setOderedColumnsState] = useState([])
  // cung mot thoi diem chi keo duoc 1 thu (column or card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
    const orderedColumn = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOderedColumnsState(orderedColumn)
  }, [board])
  //Trigger khi bat dau keo
  const handleDragStart = (event) => {
    console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACITVE_DRAG_ITEM_TYPE.CARD : ACITVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    // console.log('handleDragEnd :', event)

    // kiem tra neu khong ton tain over (keo linh tinh ra ngoai thi return luon tranh loi )
    if (!over) {
      return
    }
    //neu vi tri sau keo tha ve khac voi vi tri ban dau
    if (active.id !== over.id) {

      const oldIndex = oderedColumnsState.findIndex(c => c._id === active.id) // lay vi tri cu ( tu thang active )

      const newIndex = oderedColumnsState.findIndex(c => c._id === over.id)// lay vi tri moi ( tu thang over )
      // dung arrayMove cua thang dnd-kit de sap xep lai column ban dau
      // code cua arrayMove o day: dnd-kit/package/sortable/src/ultilities/arrayMove.ts
      const dndOrderedColumns = arrayMove(oderedColumnsState, oldIndex, newIndex)
      // 2 console.log nay dung de xu ly du lieu goi API
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log('dndOderedColumn: ', dndOrderedColumns)
      // console.log(dndOrderedColumnsIds)

      //cap nhat lai state ban dau sau khi da sap xep
      setOderedColumnsState(dndOrderedColumns)
    }


  }

  /**
     * Animation khi tha (drop) phan tu - test bang cach keo xong tha truc tiep 
     * va nhin phan giu cho overlay
     */
  const customDropAnimation = { sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        bgcolor: (theme) => ( theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0' ),
        p: '10px 0'
      }}>
        <ListColumns columns={oderedColumnsState}/>
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACITVE_DRAG_ITEM_TYPE.COLUMN) && <Columns column={activeDragItemData}/> }
          {(activeDragItemType === ACITVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/> }
        </DragOverlay>
      </Box>
    </DndContext>
  )
}
export default BoardContent