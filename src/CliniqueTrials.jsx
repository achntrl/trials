import React, { Component } from 'react';
import Trial from './Trial'

class CliniqueTrials extends Component {
  render() {
    return(
      <div className="container">
        <Trial start={20} end={70}/>
      </div>
    );
  }
}

export default CliniqueTrials
