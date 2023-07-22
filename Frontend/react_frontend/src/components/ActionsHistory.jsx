import { useState, useEffect, useContext } from "react";

import { Context } from "../store/appContext";



const History = () => {
    const { actions } = useContext(Context)
    const [history, setHistory] = useState([]);
    const [last_items, setLast_items] = useState([]);

    useEffect(() => {
        const res = actions.getHistory().then((res) => {
            setHistory(res)
            setLast_items(history.slice(Math.max(history.length - 10, 0)))
        }
        )
    }, [history]);

    return (
        <div className="p-4 bg-slate-200 rounded-md m-2">
            <h1 className=" text-slate-700 font-medium text-center text-3xl mb-8 ">Actions History</h1>
            {last_items.map((item, index) => {
                return (
                    <div className=" flex justify-evenly " key={index}>
                        
                            <h4>{item.date}</h4>
                            <h4>User {item.user_id} turned actuator id: {item.actuator_id} of board id :{item.board_id} to state : {item.state} . </h4>
                    </div>
                )
            }
            )}
        </div>
    )
}

export default History;