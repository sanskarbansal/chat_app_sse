import React from 'react'
import './Message.css';
export default (props) => {
    return (
        <div className={`Message__container ${props.self ? 'right' : 'left'}`}>
            <div className="MessageBox">
                <span>From: {props.from}</span>
                <div className="Message ">
                    <div>
                        <p>{props.message}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}