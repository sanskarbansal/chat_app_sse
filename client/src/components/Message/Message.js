import React from 'react'
import './Message.css';
export default (props) => {
    return (
        <div className={`Message__container ${props.self ? 'right' : 'left'}`}>
            <div className="MessageBox">
                <span>From: {props.from}</span>
                {props.type === 'message' ? <div className="Message "><p>{props.message}</p></div> : <img src={props.baseString} />}
            </div>
        </div>
    )
}