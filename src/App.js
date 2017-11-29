import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CliniqueTrials from './CliniqueTrials'

class App extends Component {
  trials = [
    { start: 5, end: 50, title: 'Study of Bendamustine' },
    { start: 55, end: 85, title: 'ASCT With Nivolumab' },
    { start: 70, end: 100, title: 'Study of Stockolm' },
    { start: 90, end: 115, title: 'Bortezomib' },
  ];

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <CliniqueTrials trials={this.trials}/>
      </div>
    );
  }
}

export default App;
