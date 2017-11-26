import React from 'react';
import ReactDOM from 'react-dom';
import {shallow} from 'enzyme';
import CliniqueTrials from './CliniqueTrials';

const wrapper = shallow(<CliniqueTrials />)
const cliniqueTrials = wrapper.instance()

describe('getEvents', () => {
  it('should get one start and one end event from one trial', () => {
    const trials = [{start: 0, end: 15, title: 'Essai 0'}]
    expect(cliniqueTrials.getEvents(trials))
      .toMatchObject([ { date: 0, event: 'start' }, { date: 15, event: 'end' } ])
  });

  it('should get two start and two end events ordered from two trials', () => {
    const trials = [
      {start: 0, end: 10, title: 'Essai 0'},
      {start: 15, end: 20, title: 'Essai 1'},
    ]
    expect(
      cliniqueTrials.getEvents(trials))
      .toMatchObject([
        { date: 0, event: 'start' },
        { date: 10, event: 'end' },
        { date: 15, event: 'start' },
        { date: 20, event: 'end' }
      ])
  });
});

describe('getCollisionsFromEvents', () => {
  it('should return an empty array when no collision', () => {
    const trials = [
      {start: 0, end: 10, title: 'Essai 0'},
      {start: 15, end: 20, title: 'Essai 1'},
    ];
    const events = cliniqueTrials.getEvents(trials);

    expect(cliniqueTrials.getCollisionsFromEvents(events, trials)).toMatchObject([])
  });

  it('should return a two way collision', () => {
    const trials = [
      {start: 0, end: 15, title: 'Essai 0'},
      {start: 10, end: 20, title: 'Essai 1'},
    ];
    const events = cliniqueTrials.getEvents(trials);

    expect(
      cliniqueTrials.getCollisionsFromEvents(events, trials)).toMatchObject([
        {
         "trials": [
            {start: 0, end: 15, title: 'Essai 0'},
            {start: 10, end: 20, title: 'Essai 1'},
          ],
         "collisionFactor": 2
       }
      ])
  });

  it('should return a multiple collisions', () => {
    const trials = [
      {start: 0, end: 15, title: 'Essai 0'},
      {start: 10, end: 20, title: 'Essai 1'},
      {start: 12, end: 30, title: 'Essai 2'},
      {start: 25, end: 30, title: 'Essai 3'},
    ];
    const events = cliniqueTrials.getEvents(trials);

    expect(cliniqueTrials.getCollisionsFromEvents(events, trials)).toMatchObject([
        {
         "trials": [
            {start: 0, end: 15, title: 'Essai 0'},
            {start: 10, end: 20, title: 'Essai 1'},
            {start: 12, end: 30, title: 'Essai 2'},
          ],
         "collisionFactor": 3
       }, {
        "trials": [
           {start: 12, end: 30, title: 'Essai 2'},
           {start: 25, end: 30, title: 'Essai 3'},
         ],
        "collisionFactor": 2
      }, {
        "trials": [
          {start: 0, end: 15, title: 'Essai 0'},
          {start: 10, end: 20, title: 'Essai 1'},
         ],
        "collisionFactor": 2
      }
      ])
  });
});

describe('handleCollisions', () => {
  it('should not dot anything when no collision', () => {
    const trials = [{start: 0, end: 15, title: 'Essai 0'}]
    const events = cliniqueTrials.getEvents(trials);
    const sortedCollisions = cliniqueTrials.getCollisionsFromEvents(events, trials);

    expect(cliniqueTrials.handleCollisions(sortedCollisions, trials))
      .toMatchObject(trials);
  });

  it('should handle 2 ways collisions', () => {
    const trials = [
      {start: 0, end: 15, title: 'Essai 0'},
      {start: 5, end: 20, title: 'Essai 1'},
    ]
    const events = cliniqueTrials.getEvents(trials);
    const sortedCollisions = cliniqueTrials.getCollisionsFromEvents(events, trials);

    expect(cliniqueTrials.handleCollisions(sortedCollisions, trials))
      .toMatchObject([
        {start: 0, end: 15, title: 'Essai 0', position: 0, collisionFactor: 2},
        {start: 5, end: 20, title: 'Essai 1', position: 1, collisionFactor: 2},
      ]);
  });

  it('should handle 3 ways collisions', () => {
    const trials = [
      {start: 0, end: 15, title: 'Essai 0'},
      {start: 10, end: 20, title: 'Essai 1'},
      {start: 12, end: 30, title: 'Essai 2'},
      {start: 25, end: 30, title: 'Essai 3'},
    ];

    const events = cliniqueTrials.getEvents(trials);
    const sortedCollisions = cliniqueTrials.getCollisionsFromEvents(events, trials);

    expect(cliniqueTrials.handleCollisions(sortedCollisions, trials))
      .toMatchObject([
        {start: 0, end: 15, title: 'Essai 0', position: 0, collisionFactor: 3},
        {start: 10, end: 20, title: 'Essai 1', position: 1, collisionFactor: 3},
        {start: 12, end: 30, title: 'Essai 2', position: 2, collisionFactor: 3},
        {start: 25, end: 30, title: 'Essai 3', position: 0, collisionFactor: 3},
      ]);
  });
});
