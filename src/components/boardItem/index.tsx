import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store';
import Modal from '../../components/modal';
import Button from "../../components/button"
import Input from '../../components/input';
import slice, { IBoard } from '../../store/boardSlice';
import TaskItem from '../taskItem';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core'
import XMark from "../icons/x-mark"

import { ItemTypes } from '../../types';
import EditIcon from '../icons/edit-icon';

interface IBoardProps {
  board: IBoard
  index: number
}

interface DragItem {
  index: number
  id: string
  type: string
  boardIndex?: number
}

const BoardItem: React.FC<IBoardProps> = ({ board, index }) => {

  const [isOpenTask, setIsOpenTask] = useState<boolean>(false)
  const [inputDataTask, setInputDataTask] = useState<string>("")
  const [isOpenEditBoardName, setIsOpenEditBoardName] = useState<boolean>(false)
  const [newBoardName, setNewBoardName] = useState<string>("")


  const dispatch = useDispatch<AppDispatch>();
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BOARD,
    item: () => {
      return { 
        id: board.boardId,
        index, 
        type: ItemTypes.BOARD 
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  })
  
  const [, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
    >({
    accept: [ItemTypes.BOARD, ItemTypes.TASK],
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index

      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      if (item.type === ItemTypes.TASK) {
        // if board id is the same as task board id -> return;
        if (index === item.boardIndex) {
          return
        }

        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
          
        // Determine mouse position
        const clientOffset = monitor.getClientOffset()

        // Get pixels to the top
        const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

        const boardStartIndex = item?.boardIndex as number

        console.log(hoverMiddleY, hoverClientY)

        if (hoverMiddleY > hoverClientY) {
          dispatch(slice.actions.dropTaskOnBoard({ dragIndex, boardStartIndex, boardTargetIndex: boardIndex, dropOnTop: true }))
          //update index ------ IMPORTANT
          item.index = 0
        } else {
          dispatch(slice.actions.dropTaskOnBoard({ dragIndex, boardStartIndex, boardTargetIndex: boardIndex, dropOnTop: false }))
          item.index = board.tasks.length
        }

        item.boardIndex = index;
   
        return;
      }

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen

      // Get vertical middle
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return
      }

      // Time to actually perform the action
      dispatch(slice.actions.swapBoards({ dragIndex, hoverIndex }))

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const boardIndex = index
  drag(drop(ref))
  
  return (
    <div 
      ref={ref}
      className={isDragging ? 'rounded text-center w-80 min-w-80 min-h-96 max-h-full m-3 mt-5 border-solid border-2 bg-slate-400' : 'rounded text-center w-80 min-w-80 min-h-96 max-h-full m-3 mt-5 border-solid border-2 bg-slate-400/[0.35]'}
    >
      <div className='flex flex-row-reverse bg-gradient-to-r from-cyan-500 to-blue-500'>
        <div 
          className="button-24 mt-3 mr-2 ml-auto mb-auto w-5 h-5"
          onClick={() => dispatch(slice.actions.deleteBoard(board.boardId))}
        >
          <div className='w-4 h-4 pl-px pt-px'>
            <XMark/>
          </div>
    
        </div>
        <div 
          onClick={() => setIsOpenEditBoardName(true)}
          className="button-24 mt-3 mr-1 ml-auto mb-auto w-5 h-5"
        >
          <div className='w-4 h-4 pl-px pt-px'>
            <EditIcon/>
          </div>
        </div>
        <div className='text-white align-middle basis-5/6 text-lg pt-2 pb-2'>{board.title}</div>
      </div>
      {board.tasks.map((task, index) => (
        <TaskItem 
          key={task.taskId} 
          task={task}
          index={index}
          boardIndex={boardIndex}
        />
      ))}
      <Button 
        className='w-28 h-10 relative mt-3 mb-3 text-sm/none align-middle'
        onClick={() => setIsOpenTask(true)}
      >Add task</Button>
      <Modal
        handleClose={() => setIsOpenTask(false)}
        isOpen={isOpenTask}
        title='Enter name of the new task'
        closeButtonText='Cancel'
        submitButtonText='Create task'
        handleSubmit={() => {
          setIsOpenTask(false)
          const createTaskData = {inputData: inputDataTask, id: board.boardId}
          dispatch(slice.actions.createTask(createTaskData))
        }}
      >
        <Input 
          type="text" 
          className='mb-auto'
          onChange={(e) => setInputDataTask(e.target.value)}
        />
      </Modal>

      <Modal
        handleClose={() => setIsOpenEditBoardName(false)}
        isOpen={isOpenEditBoardName}
        title='Enter new name of the board'
        closeButtonText='Cancel'
        submitButtonText='Complete!'
        handleSubmit={() => {
          setIsOpenEditBoardName(false)
          dispatch(slice.actions.setNewBoardName({inputData: newBoardName, index}))
        }}
      >
        <Input 
          type="text" 
          className='mb-auto'
          onChange={(e) => setNewBoardName(e.target.value)}
        />
      </Modal>
    </div>
  )
}

export default BoardItem
