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

    handleImageChange = () => {
        let reader = new FileReader();
        let file = document.getElementById('imageFileInput').files[0];
        let baseString;
        const { rName, name } = this.state;
        reader.onloadend = (data) => {
            baseString = data.target.result;
            Axios.post(`http://${address.hostname}/image`, { rName, name, baseString });
        }
        reader.readAsDataURL(file);
    }

    render() {
        let Messages = this.state.messages.map(m => {
            if (this.state.name === m.name) {
                if (m.type === "message") return <Message self from={m.name} message={m.message} type="message" key={m.key} />
                else return <Message self from={m.name} baseString={m.baseString} type="image" key={m.key} />
            }

            if (m.type === "message") return <Message  from={m.name} message={m.message} type="message" key={m.key} />
            else return <Message  from={m.name}  baseString={m.baseString} type="image" key={m.key} />
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
                    <form>
                        <input type="file" onChange={this.handleImageChange} name="image" id="imageFileInput" accept="image/*" />
                    </form>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="imageFileInput" id="imageFile"><span><i className="material-icons">add_to_photos</i></span></label>
                        <input autoComplete="off" type="text" name="message" value={this.state.message} placeholder="Enter Message" onChange={this.handleInput} />
                        <button>></button>
                    </form>
                </div>
                <button className="btn" onClick={this.leaveRoom}>Leave</button>
            </div>
        )
    }
}