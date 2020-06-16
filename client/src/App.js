import React from 'react';
import './App.css';
import Authform from './components/Authform/Authform';
import { Route, Switch } from 'react-router-dom';
import ChatBox from './container/ChatBox'; 
function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/chat-room/" render={props=> <ChatBox {...props} />  }/>
        {/* <Route exact path="/chat-room/:rName/:name" render={props=> <ChatBox {...props} />  }/> */}
        <Route path="/" render={props => <Authform {...props} />} />
      </Switch>
    </div>
  );
}

export default App;
