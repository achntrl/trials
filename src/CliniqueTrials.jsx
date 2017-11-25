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

  componentWillMount() {
    let trials = this.state.trials;
    const startTrials = _.sortBy(trials, ['start']);
    const endTrials = _.sortBy(trials, ['end']);

    const startEvents = _.map(startTrials, function (trial){ return {'date': trial.start, 'event': 'start'} });
    const endEvents = _.map(endTrials, function (trial){ return {'date': trial.end, 'event': 'end'} });

    const allEvents = _.sortBy( _.concat(startEvents,endEvents), ['date'])


    let collisions = {0:0}
    let acc = 0
    for (let i=0; i < allEvents.length; ++i) {
      let anEvent = allEvents[i]
      acc += anEvent.event == 'start' ? +1 : -1
      collisions[anEvent.date] = acc
    }

    let locationOfCollisions = _.compact(_.map(collisions, (val, key) => {if (val > 1) return key}))

    let findTrialsAtCollision = (position, trials) => {
      return _.filter(trials, trial => {
        return trial.start <= position && position <= trial.end;
      })
    }

    let handleCollision = (collidings) => {
      if (collidings[0].position === undefined && collidings[1].position === undefined) {
        collidings[0].position = 0;
        collidings[1].position = 1;
      } else if (collidings[0].position === undefined) {
        collidings[0].position = 1 - collidings[1].position;
      } else if (collidings[1].position === undefined) {
        collidings[1].position = 1 - collidings[0].position;
      }
      collidings[0].collide = true
      collidings[1].collide = true
    }

    _.map(locationOfCollisions, (collision) => {
      handleCollision(findTrialsAtCollision(parseInt(collision, 10), trials));
    } )
    console.log(trials)
    this.setState({trials});
  }
  widthMonthToPx = (month) => { return this.state.step * month}

  renderTrial = (trial) => {
    return <Trial
      start={this.widthMonthToPx(trial.start)}
      end={this.widthMonthToPx(trial.end)}
      height={this.state.height}
      collisionFactor={trial.collide ? 2 : 1}
      position={trial.position ? trial.position : 0}
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
