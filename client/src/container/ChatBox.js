import React, { Component } from 'react'
import Axios from 'axios';
import './ChatBox.css';
import Message from '../components/Message/Message';
import address from '../hostname.js'
export default class ChatBox extends Component {
    constructor(props) {
        super(props);
        let rName = this.props.location.rName || localStorage.getItem('rName');
        let name = this.props.location.name || localStorage.getItem('name');
        rName = rName ? rName.trim() : null; 
        name = name ? name.trim() : null; 
        this.state = {
            rName,
            name,
            message: '',
            messages: []
        }
    }

    removeItem = () => {
        localStorage.removeItem('rName');
        localStorage.removeItem('name');
    }
    setItem = () => {
        localStorage.setItem('rName', this.state.rName);
        localStorage.setItem('name', this.state.name);
    }
    handleScroll = () => {
        const m = document.getElementsByClassName('Messages')[0];
        const dist = m.scrollHeight - m.clientHeight;
        m.scrollBy(0, dist);
    }
    handleInput = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        })
    }
    componentDidMount() {
        let rName = this.state.rName;
        let name = this.state.name;
        if (!rName || !name) {
            this.props.history.push('/');
        } else {
            this.setItem();
        }
        this.ws = new EventSource(`http://${address.hostname}/event-stream/?rName=${rName}&name=${name}`);
        this.ws.onmessage = (event) => {
            this.setState({
                ...this.state,
                messages: [...this.state.messages, JSON.parse(event.data)]
            }, () => {
                this.handleScroll();
            });
        }
        this.handleScroll();
    }
    handleSubmit = (event) => {
        event.preventDefault();
        const { rName, name, message } = this.state;
        Axios.post(`http://${address.hostname}/message`, { rName, name, message });
        this.setState({
            ...this.state,
            message: ''
        });
    }
    leaveRoom = () => {
        this.removeItem();
        window.location.reload();
    }
    render() {
        let Messages = this.state.messages.map(m => {
            if (this.state.name === m.name) {
                return <Message self from={m.name} message={m.message} key={m.key} />
            }
            return <Message from={m.name} message={m.message} key={m.key} />
        });
        return (
            <div className="ChatBox">
                <div className="ChatBox__container">
                    <div className="ChatBox__heading">
                        <span>{this.state.rName}</span>
                    </div>
                    <div className="Messages">
                        {Messages}
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <input autoComplete="off" type="text" name="message" value={this.state.message} placeholder="Enter Message" onChange={this.handleInput} />
                        <button>></button>
                    </form>
                </div>
                <button className="btn" onClick={this.leaveRoom}>Leave</button>
            </div>
        )
    }
}