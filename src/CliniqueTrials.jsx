import React, { Component } from 'react';
import Trial from './Trial'
import Ruler from './Ruler'
import _ from 'lodash'
import './CliniqueTrials.css'

class CliniqueTrials extends Component {
  constructor() {
    super();
    this.state = {
      width: 720,
      height: 250,
      trials: [
        { start: 5, end: 50, title: 'Study of Bendamustine' },
        { start: 55, end: 85, title: 'ASCT With Nivolumab' },
        { start: 70, end: 100, title: 'Study of Stockolm' },
        { start: 90, end: 115, title: 'Bortezomib' },
      ],
      step: 720 / 120  // Over 10 years
    };
  }

  /**
   * Return the list of all events (starting or ending of a trial) sorted by date
   *
   * Sample output data: [{date: 0, event: "start"}, {date: 10, event: "end"}, ...]
   *
   * Complexity: o(n log n) (bound by the sortBy)
   */
  getEvents(trials) {
    const startTrials = _.sortBy(trials, ['start']);
    const endTrials = _.sortBy(trials, ['end']);

    const startEvents = _.map(startTrials, trial => { return {'date': trial.start, 'event': 'start'} });
    const endEvents = _.map(endTrials, trial => { return {'date': trial.end, 'event': 'end'} });

    return _.sortBy(_.concat(startEvents,endEvents), ['date'])
  }

  /**
   * Get all the collisions built from the event data. Return them ordered by the
   * collision factor (number of trials involved in the collision).
   *
   * Sample output data:
   * [{
   *   "trials": [
   *      {"start": 12, "end": 35, "title": "Essai 2"},
   *      {"start": 23, "end": 33, "title": "Essai 3"},
   *      {"start": 32, "end": 40, "title": "Essai 4"}
   *    ],
   *   "collisionFactor": 3
   * }, ...]
   *
   * Complexity: o(n^2) because findTrialsAtPosition is o(n)
   */
  getCollisionsFromEvents(events, trials) {
    let collisionsCount = {0:0}
    let accumulator = 0
    for (let i=0; i < events.length; ++i) {
      let anEvent = events[i]
      accumulator += anEvent.event === 'start' ? +1 : -1
      collisionsCount[anEvent.date] = accumulator
    }
    const collisionsPositions = _.compact(_.map(collisionsCount, (val, key) => {if (val > 1) return key}))

    const collisionsMap = _.map(collisionsPositions, collisionPosition => {
      const collisions = this.findTrialsAtPosition(parseInt(collisionPosition, 10), trials)
      return {trials: collisions, collisionFactor: collisions.length }
    })

    return _.reverse(_.sortBy(_.uniqWith(collisionsMap, _.isEqual), ['collisionFactor']))
  }

  /**
   * Handle all the collisions : for each collision, the function separate
   * trials with position and trials without position, and give remaining slots
   * to trials without position
   *
   * Sample output data: {"start": 12, "end": 35, "title": "Essai 2", collisionFactor: 3, position: 1},
   *
   * Complexity: o(n^2)
   */
  handleCollisions(sortedCollisions, trials) {
    _.map(sortedCollisions, collision => {
      // Assert rule #2
      const biggestCollisionFactor = _.max(_.map(collision.trials, trial => trial.collisionFactor)) || collision.collisionFactor

      // Get available positions (the ones that are not already occupied)
      const trialsWithPosition = _.filter(collision.trials, trial => trial.position !== undefined)
      const positions = _.map(Array(biggestCollisionFactor), (e, i) => i)
      const usedPositions = _.map(trialsWithPosition, 'position')
      const remainingPositions = _.difference(positions, usedPositions)

      // Allocate the remaining positions to the trials without positions
      // One invariant is that trialsWithoutPosition.length <= remainingPositions.length
      const trialsWithoutPosition = _.filter(collision.trials, trial => trial.position === undefined)
      _.map(trialsWithoutPosition, (trial, index) => {
        trial.position = remainingPositions[index]
        trial.collisionFactor = biggestCollisionFactor
      })
    })

    return trials
  }

  /**
   * Helper function that get all the trials at a given date
   *
   * Complexity: o(n) This could be optimized in the future by using a interval
   * tree. It could bring the complexity to o(log n)
   */
  findTrialsAtPosition(position, trials) {
    return _.filter(trials, trial => {
      return trial.start <= position && position <= trial.end;
    })
  }

  componentWillMount() {
    let trials = this.state.trials

    const events = this.getEvents(trials)
    const sortedCollisions = this.getCollisionsFromEvents(events, trials)

    const positionnedTrials = this.handleCollisions(sortedCollisions, trials)

    this.setState({trials: positionnedTrials});
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
        <Ruler/>
      </div>
    );
  }
}

export default CliniqueTrials
