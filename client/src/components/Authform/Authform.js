import React, { Component } from 'react'
import './Authform.css';
import { Link } from 'react-router-dom'
export default class Authform extends Component {
    constructor(props){
        super(props); 
        this.state = {
            rName: '',
            name: ''
        }

    }
    handleInput = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        });
    }
    handleSubmit = (event) => { 
        event.preventDefault();
    }
    componentDidMount(){
        let rName = localStorage.getItem('rName'); 
        let name = localStorage.getItem('name');
        rName = rName ? rName.trim() : null; 
        name = name ? name.trim() : null; 
        if(rName && name){
            this.props.history.push('/chat-room'); 
        } 
    }
    render() {
        return (
            <div className="Authform__container">
                <h1 className="Authform--heading">Chat Room</h1>
                <form className="Authform" method="post" action="/join" onSubmit={this.handleSubmit}>
                    <label>Chat Room</label>
                    <input autoComplete="off"  onChange={this.handleInput} name="rName" type="text" placeholder="Enter Chat Room" />
                    <label>Name</label>
                    <input  autoComplete="off" onChange={this.handleInput} name="name" type="text" placeholder="Enter Your Name" />
                    {/* <Link to={`/chat-room/${this.state.rName}/${this.state.name}`}> */}
                    <Link to={{
                        pathname: '/chat-room/', 
                        rName: this.state.rName, 
                        name: this.state.name
                    }}
                    >
                        <button type="submit" className="btn btn-primary">Join Room</button>
                    </Link>
                </form>
            </div>
        )
    }
}