import React, { Component } from 'react';
import Trial from './Trial'
import _ from 'lodash'

class CliniqueTrials extends Component {
  constructor() {
    super();
    this.state = {
      width: 720,
      height: 250,
      trials: [
        {start: 0, end: 15, title: 'Essai 0'},
        {start: 5, end: 10, title: 'Essai 1'},
        {start: 12, end: 28, title: 'Essai 2'},
        {start: 23, end: 25, title: 'Essai 3'},
        {start: 32, end: 120, title: 'Essai 4'},
      ],
      step: 720 / 120  // Over 10 years
    };
  }

  widthMonthToPx = (month) => { return this.state.step * month}

  renderTrial = (trial) => {
    return <Trial
      start={this.widthMonthToPx(trial.start)}
      end={this.widthMonthToPx(trial.end)}
      height={this.state.height}
      collisionFactor={trial.start % 2 ? 1 : 2}
      position={trial.end % 2 ? 0 : 1}
      title={trial.title}
      key={trial.title}
    />;
  }



  render() {
    return(
      <div className="container">
        {_.map(this.state.trials, (trial) => this.renderTrial(trial))}
      </div>
    );
  }
}

export default CliniqueTrials
