import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext, PointerSensor, useSensor, useSensors, MouseSensor, TouchSensor, DragOverlay, defaultDropAnimationSideEffects, closestCorners } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Columns from './ListColumns/Column/Columns'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep } from 'lodash'

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

  //Tim mot cai column theo cardId
  const findColumnByCardId = (cardId) => {
    /**
     * Doan du lieu nay can luu y, nen dung c.cards thay vi c.cardOrderIds boi vi o buoc handleDragOver chung ta
     * se lam du lieu cho cards hoan chinh truoc roi moi tao ra cardOrderIds moi.(Bai 33 21.30)
     */
    return oderedColumnsState.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  //Trigger khi bat dau keo
  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACITVE_DRAG_ITEM_TYPE.CARD : ACITVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }


  //Trigger khi keo mot phan tu
  const handleDragOver = (event) => {
    //Khong lam gi them khi keo tha column
    if (activeDragItemType === ACITVE_DRAG_ITEM_TYPE.COLUMN) {
      return
    }

    //con neu keo card thi co xu ly them de co the keo card qua lai giua cac columns
    // console.log('handleDragOver: ', event)
    const { active, over } = event
    /**
     * can dam bao neu khong ton tai active or over (khi keo ra khoi pham vi container) thi khong lam gi (tranh crash trang)
     */
    if ( !active || !over ) return
    //object destructuring
    /**
     *activeDraggingCard: cai card dang duoc keo
    overCard : la cai card dang tuong tac tren or duoi so voi cai card duoc keo o tren.
    */
    const { id: activeDraggingCardId, data:{ current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    // tim 2 columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    // console.log(activeColumn)
    // console.log(overColumn)
    // neu khong ton tai column khong lam gi het
    if (!activeColumn || !overColumn) {
      return
    }
    /**xu ly logic o day chi khi keo card qua 2 column khac nhau , con neu keo card trong chinh column ban dau
     * cua no thi khong lam gi
     *Vi o day dang la doan xu ly luc keo (handleDragOver) con xu ly luc keo xong xuoi thi no lai la van de khac o (handleDragEnd)
    */
    if (activeColumn._id !== overColumn._id) {
      setOderedColumnsState(prevColumns => {
        // tim vi tri (index) cua cai overCard trong column dich (noi activecard sap duoc tha)
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

        /**
         * Logic tinh toan "CardIndex Moi" (Tren hoac duoi cua overCard) lay chuan dau ra tu code cua thu vien - nhieu khi muon tu choi hieu =))
         */
        let newCardIndex

        const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height

        const modifier = isBelowOverItem ? 1 : 0

        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        // console.log('isBelowOverItem', isBelowOverItem)
        // console.log('modifier', modifier)
        // console.log('newCardIndex', newCardIndex)

        /**Clone mang orderedColumnsState cu ra mot cai moi de xu ly data
         * roi return - cap nhat lai OrderedColumnsState moi*/
        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column.id === overColumn._id)

        //Column cu
        if (nextActiveColumn) {
          // xoa card o cai column active (cung co the hieu la column cu, cai luc ma keo card ra khoi no de Sang column khac)
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

          // cap nhat lai mang cardOrderIds cho chuan du lieu
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }


        //Column moi
        if (nextOverColumn) {
          //Kiem tra xem card dang keo no co ton tai o overColumn hay chua , neu co thi can xoa di truoc
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
          //tiep theo la them card dang keo vao overColumn theo vi tri index moi
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)
          //cap nhat lai mang cardOrderIds sao cho chuan du lieu
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }
        console.log('nextColumns: ', nextColumns)

        return nextColumns
      })
    }
  }

  //Trigger khi ket thuc hanh dong keo (drag) mot phan tu => hanh dong tha (drop)
  const handleDragEnd = (event) => {
    const { active, over } = event
    // console.log('handleDragEnd :', event)

    if (activeDragItemType === ACITVE_DRAG_ITEM_TYPE.CARD) return

    // can dam bao neu khong ton tai active or over (khi keo ra khoi pham vi container) thi khong lam gi (tranh crash trang)
    if (!active || !over) {
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
      onDragOver={handleDragOver}
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