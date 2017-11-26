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
        {start: 12, end: 35, title: 'Essai 2'},
        {start: 23, end: 33, title: 'Essai 3'},
        {start: 32, end: 40, title: 'Essai 4'},
        {start: 45, end: 55, title: 'Essai 5'},
        {start: 50, end: 70, title: 'Essai 6'},
        {start: 85, end: 100, title: 'Essai 7'},
        {start: 110, end: 120, title: 'Essai 8'},
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

    const allEvents = _.sortBy(_.concat(startEvents,endEvents), ['date'])


    let collisionsCount = {0:0}
    let acc = 0
    for (let i=0; i < allEvents.length; ++i) {
      let anEvent = allEvents[i]
      acc += anEvent.event === 'start' ? +1 : -1
      collisionsCount[anEvent.date] = acc
    }

    let collisionsPositions = _.compact(_.map(collisionsCount, (val, key) => {if (val > 1) return key}))

    const findTrialsAtCollision = (position, trials) => {
      return _.filter(trials, trial => {
        return trial.start <= position && position <= trial.end;
      })
    }

    const  collisionsMap = _.map(collisionsPositions, collision => {
      const collisions = findTrialsAtCollision(parseInt(collision, 10), trials)
      return {collisions: collisions, number: collisions.length }
    })

    const sortedCollisions = _.reverse(_.sortBy(_.uniqWith(collisionsMap, _.isEqual), ['number']))

    let handleCollisions = (sortedCollisions) => {
      _.map(sortedCollisions, collisions => {
        const collisionsWithoutPosition = _.filter(collisions.collisions, collision => collision.position === undefined)
        const collisionsWithPosition = _.filter(collisions.collisions, collision => collision.position !== undefined)
        const usedPositions = _.map(collisionsWithPosition, 'position')
        const biggestCollisionFactor = _.max(_.map(collisions.collisions, collision => collision.collisionFactor)) || collisions.number
        const positions = _.map(Array(biggestCollisionFactor), (e, i) => i)
        const remainingPositions = _.difference(positions, usedPositions)

        _.map(collisionsWithoutPosition, (collision, index) => {
          collision.position = remainingPositions[index]
          collision.collisionFactor = biggestCollisionFactor
        })
      })
    }
    handleCollisions(sortedCollisions);
    this.setState({trials});
  }
  widthMonthToPx = (month) => { return this.state.step * month}

  renderTrial = (trial) => {
    return <Trial
      start={this.widthMonthToPx(trial.start)}
      end={this.widthMonthToPx(trial.end)}
      height={this.state.height}
      collisionFactor={trial.collisionFactor ? trial.collisionFactor : 1 }
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
