import React, { Component } from 'react';
import Trial from './Trial'
import _ from 'lodash'

class CliniqueTrials extends Component {
  constructor() {
    super();
    this.state = {
      width: 720,
      trials: [
        {start: 0, end: 4, title: 'Essai 0'},
        {start: 5, end: 10, title: 'Essai 1'},
        {start: 12, end: 20, title: 'Essai 2'},
        {start: 23, end: 25, title: 'Essai 3'},
        {start: 26, end: 120, title: 'Essai 4'},
      ],
      step: 720 / 120  // Over 10 years
    };
  }

  renderTrial = (trial) => {
    return <Trial
      start={this.state.step * trial.start}
      end={this.state.step * trial.end}
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
