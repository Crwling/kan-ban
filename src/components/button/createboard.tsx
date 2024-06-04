// import React, {useState} from "react";
// import { useDispatch } from "react-redux";
// //в бордпейдж
// const CreateBoardButton = () => {

//     const {state, setState} = useState<string>("")
//     const dispatch = useDispatch();

//     const handleCreateBoard = (e) => {
//         e.preventDefault();
//         dispatch(createBoard(state))
//     }


//     return (
//         <div>
//             <input
//                 onChange={(e) => setState(e.target.value)}
//             />
//             <div>
//                 <button
//                     onClick={handleCreateBoard}
//                 >OK</button>
//                 <button>Cancel</button>
//             </div>
//         </div>
//     )
// }