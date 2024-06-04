import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../store';
import Modal from '../../components/modal';
import Button from "../../components/button"
import Input from '../../components/input';
import slice from '../../store/boardSlice';
import BoardItem from '../../components/boardItem';

const BoardPage: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const [isOpenBoard, setIsOpenBoard] = useState<boolean>(false)
  const [inputDataBoard, setInputDataBoard] = useState<string>("")

  const handleSubmitBoard = () => {
    setIsOpenBoard(false)
    dispatch(slice.actions.createBoard(inputDataBoard))
  }

  const boards = useSelector(slice.selectors.selectBoards)

  return (
    <>
      <div className='m-3'>
        <Button 
          className='text-base'
          onClick={() => setIsOpenBoard(true)}
        >Create Board</Button>
      </div>
      <div className='flex flex-row flex-nowrap'>
        {boards.map((board, index) => (<BoardItem key={board?.boardId} board={board} index={index}/>))}
      </div>
      <Modal 
        handleClose={() => setIsOpenBoard(false)}
        isOpen={isOpenBoard}
        title='Enter name of the new board'
        closeButtonText='Cancel'
        submitButtonText='Create board'
        handleSubmit={handleSubmitBoard}
      >
        <Input 
          type="text" 
          className='mb-auto'
          onChange={(e) => setInputDataBoard(e.target.value)}
        />
      </Modal>
    </>
  )
}

export default BoardPage
