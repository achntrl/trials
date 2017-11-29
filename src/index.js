import React from 'react';
import ReactDOM, { render } from 'react-dom';
import './index.css';
import App from './App';
import CliniqueTrials from './CliniqueTrials'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

const renderCliniqualTrials = trials => {
  return <CliniqueTrials trials={trials}/>;
};

export default renderCliniqualTrials;
