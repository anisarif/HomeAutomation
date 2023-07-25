import Lock from "./Lock";
import { getActuators } from "../../../utils/api";
import { useState, useEffect, useContext } from 'react';
import { decodeToken } from "react-jwt";
import { Context } from "../../../store/appContext";

const Locks = () => {
    const [locks, setLocks] = useState([]);
    const { store } = useContext(Context)
    const [currentId, setCurrentId] = useState("")
    const [boardsList, setBoardsList] = useState([])
  
    useEffect(() => {
      const getId = () => {
        if (store.token && store.token !== undefined && store.token !== null) {
          const myDecodedToken = decodeToken(store.token);
          const current = myDecodedToken.current_user
          setCurrentId(current.id)
          sessionStorage.setItem("current_user", current)
        }
      }
      getId()
    }, [store.token]);
  
    useEffect(() => {
      const fetchData = async () => {
        if (currentId && currentId !== undefined && currentId !== "") {
          const currentActuators = await getActuators()
          const filteredActuators = currentActuators.filter(actuator => actuator.type === "Lock")
          setLocks(filteredActuators)
          const url = `http://127.0.0.1:5000/api/user/boards/${currentId}`
          const res = await fetch(url)
          const boardsAuth = await res.json();
          setBoardsList(boardsAuth)
        }
      }
      fetchData().catch(console.error)
    }, [currentId])
  
    const boardIds = boardsList.map(board => board.id);
  
    return (
      <div className="p-4 bg-slate-200 rounded-md">
        <h1 className=" text-slate-700 font-medium text-center text-3xl mb-8">Lockers</h1>
        {boardsList.length > 0 && locks.map((lock) => {
          if (boardIds.includes(lock.board_id)) {
            return (
              <div  key={lock.id}>
                <Lock name={lock.name} id={lock.id} state={lock.state} />
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  }
  
  export default Locks;