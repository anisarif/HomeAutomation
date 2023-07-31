import Light from "./Light";
import { getActuators } from "../../../utils/api";
import { useState, useEffect, useContext } from 'react';
import { decodeToken } from "react-jwt";
import { Context } from "../../../store/appContext";


const Lights = () => {

    const [lights, setLights] = useState([]);
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
          const filteredActuators = currentActuators.filter(actuator => actuator.type === "Light")
          setLights(filteredActuators)
          const url = `https://197.240.120.86:5000/api/user/boards/${currentId}`
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
        <h1 className=" text-slate-700 font-medium text-center text-3xl mb-8">Lights</h1>
        {boardsList.length > 0 && lights.map((light) => {
          if (boardIds.includes(light.board_id)) {
            return (
              <div  key={light.id}>
                <Light name={light.name} id={light.id} state={light.state} />
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  }

  export default Lights;