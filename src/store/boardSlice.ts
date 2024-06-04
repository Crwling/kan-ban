import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash"

export interface ITask {
    taskId: string,
    text?: string,
}

export interface IBoard {
    boardId: string,
    title: string,
    tasks: ITask[],
}

export interface IBoardInitialState {
    boards: IBoard[],
}

export const initialState: IBoardInitialState = {
    boards: [],
}

const slice = createSlice({
    name: 'boards',
    initialState: initialState,
    reducers: {
        createBoard: (state, action: PayloadAction<string>) => {

            state.boards = [
                ...state.boards, 
                {
                    boardId: uuidv4(),
                    title: action.payload,
                    tasks: [],
                }
            ]
        },
        createTask: (state, action: PayloadAction<{inputData: string, id: string}>) => {
            const { inputData, id } = action.payload
            state.boards = state.boards.map((b) => {
                if (b.boardId === id) {
                    return {
                        ...b,
                        tasks: [...b.tasks, {
                            taskId: uuidv4(),
                            text: inputData
                        }]
                    }
                }

                return b;
            })
        },
        deleteBoard: (state, action: PayloadAction<string>) => {
            state.boards = state.boards.filter((board) => {
                return board.boardId !== action.payload 
            })
        },
        deleteTask: (state, action: PayloadAction<string>) => {

            state.boards = state.boards.map((board) => ({
                ...board,
                tasks: board.tasks.filter((task) => task.taskId !== action.payload)
            }));
        },
        swapBoards: (state, action: PayloadAction<{dragIndex: number, hoverIndex: number}>) => {
            const {dragIndex, hoverIndex} = action.payload
            const updatedBoards = _.cloneDeep(state.boards)

            const tempBoard = updatedBoards[hoverIndex]
            updatedBoards[hoverIndex] = updatedBoards[dragIndex]
            updatedBoards[dragIndex] = tempBoard
            state.boards = updatedBoards
        },
        swapTasks: (state, action: PayloadAction<{dragIndex: number, hoverIndex: number, boardStartIndex: number, boardTargetIndex: number}>) => {
            const { dragIndex, hoverIndex, boardStartIndex, boardTargetIndex } = action.payload
            const updatedBoards = _.cloneDeep(state.boards)

            const tempTask = updatedBoards[boardStartIndex].tasks[dragIndex];

            updatedBoards[boardStartIndex].tasks.splice(dragIndex, 1)
            updatedBoards[boardTargetIndex].tasks.splice(hoverIndex, 0, tempTask)

            state.boards = updatedBoards
        },
        dropTaskOnBoard: (state, action: PayloadAction<{dragIndex: number, boardStartIndex: number, boardTargetIndex: number, dropOnTop: boolean}>) => {

            const { dragIndex, boardStartIndex, boardTargetIndex, dropOnTop } = action.payload
            const updatedBoards = _.cloneDeep(state.boards)

            const tempTask = updatedBoards[boardStartIndex].tasks[dragIndex];
            console.log(tempTask);

            updatedBoards[boardStartIndex].tasks.splice(dragIndex, 1)

            if (dropOnTop) {
                console.log("top");
                updatedBoards[boardTargetIndex].tasks.unshift(tempTask)
            } else {
                console.log("bootom");
                updatedBoards[boardTargetIndex].tasks.push(tempTask)
            }

            state.boards = updatedBoards
        },
        setNewBoardName: (state, action: PayloadAction<{inputData: string, index: number}>) => {
            
            const { inputData, index } = action.payload
            state.boards[index]["title"] = inputData

        },
        setNewTaskName: (state, action: PayloadAction<{inputData: string, index: number, boardIndex: number }>) => {

            const { inputData, index, boardIndex } = action.payload 
            state.boards[boardIndex].tasks[index].text = inputData
        },
    },
    // extraReducers { ... тут хендлить thunks async }
    selectors: {
        selectBoards: (state) => state.boards,
  }
})

export default slice
