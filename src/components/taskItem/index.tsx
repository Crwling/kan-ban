import React, { useRef, useState } from "react"
import slice, { ITask } from "../../store/boardSlice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../store"
import { ItemTypes } from "../../types"
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core'
import Modal from "../modal"
import Input from "../input"
import EditIcon from '../icons/edit-icon';
import DeleteBin from "../icons/delete-bin"

interface ITaskProps {
  task: ITask
  index: number
  boardIndex: number
}

interface DragTask {
  index: number
  id: string
  type: string
  boardIndex: number
}

const TaskItem: React.FC<ITaskProps> = ({ task, index, boardIndex }) => {

  const [isOpenEditTaskName, setIsOpenEditTaskName] = useState<boolean>(false)
  const [newTaskName, setNewTaskName] = useState<string>("")

  console.log(index, boardIndex, task);

  const dispatch = useDispatch<AppDispatch>()
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: () => {
      return { 
        id: task.taskId,
        index, 
        type: ItemTypes.TASK,
        boardIndex
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  })
  
  const [{ handlerId }, drop] = useDrop<
    DragTask,
    void,
    { handlerId: Identifier | null }
    >({
    accept: ItemTypes.TASK,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragTask, monitor) {
      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index
      const boardStartIndex = item.boardIndex

      // Don't replace items with themselves
      if (dragIndex === hoverIndex && boardStartIndex === boardIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      dispatch(slice.actions.swapTasks({ dragIndex, hoverIndex, boardStartIndex, boardTargetIndex: boardIndex }))

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
      item.boardIndex = boardIndex
    },
  })

  drag(drop(ref))


  return (
    <>
      <div ref={ref} className={isDragging ? " rounded m-1 mt-2 border-solid flex flex-row-reverse border-1 bg-teal-700 min-h-10" : "rounded m-1 mt-2 border-solid flex flex-row-reverse border-2 bg-teal-600/[0.85] min-h-10"}>
        <div className="flex flex-row-reverse h-full">  
          <div 
              className="button-24 justify-center mt-2 mr-1 ml-auto mb-auto w-5 h-5 text-sm/tight" 
              onClick={() => dispatch(slice.actions.deleteTask(task.taskId))}
          >
            <div className="w-4 h-4 pl-px pt-px ">
              <DeleteBin/>
            </div>
          </div>
          <div
              className="button-24 mt-2 mr-1 ml-auto mb-auto w-5 h-5 text-sm/tight"
              onClick={() => setIsOpenEditTaskName(true)}
          >
            <div className='w-4 h-4 pl-px pt-px'>
              <EditIcon/>
            </div>
          </div>
          <div className="ml-2 mt-1 mr-2 text-lg basis 5/6 w-60">{task.text}</div>
        </div>
      </div>

      <Modal
      handleClose={() => setIsOpenEditTaskName(false)}
      isOpen={isOpenEditTaskName}
      title='Enter new name of the task'
      closeButtonText='Cancel'
      submitButtonText='Complete!'
      handleSubmit={() => {
        setIsOpenEditTaskName(false)
        dispatch(slice.actions.setNewTaskName({inputData: newTaskName, index, boardIndex}))
      }}
      >
      <Input 
        type="text" 
        className='mb-auto'
        onChange={(e) => setNewTaskName(e.target.value)}
      />
      </Modal>
    </>


  )
}

export default TaskItem
