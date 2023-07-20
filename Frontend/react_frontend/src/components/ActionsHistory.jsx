import { useState, useEffect, useContext } from "react";

import { Context } from "../store/appContext";



const History = () => {
    const { actions } = useContext(Context)
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const res = actions.getHistory().then((res) => {
            setHistory(res)
            console.log(typeof res)
        }
        )
    }, []);

    return (
        <div>
            {history.map((item, index) => {
                return (
                    <div key={index}>
                        <h4>User {item.user_id} turned actuator id: {item.actuator_id} of board id :{item.board_id} to state : {item.state} . </h4>
                        <h4>{item.date}</h4>
                    </div>
                )
            }
            )}
        </div>
    )
}

export default History;