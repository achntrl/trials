import React from 'react';

const Trial = (props) => {
  const style = {
    height: props.height / props.collisionFactor  - 4 + 'px',
    top: 10 + (props.height / props.collisionFactor + 2) * props.position + 'px',
    width: (props.end - props.start) - 2 + 'px',
    left: props.start + 'px',
    backgroundColor: '#f8f8f2',
    color: '#282a36',
    position: 'absolute',
    border: '1px solid #282a36',
    overflowWrap: 'break-word'
  };

  return(
    <div style={style}>
    <p>{props.title}</p>
    </div>
  );
}

export default Trial

