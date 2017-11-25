import React from 'react';

const Trial = (props) => {
  const style = {
    height: props.height / props.collisionFactor + 'px',
    marginTop: (props.height / props.collisionFactor) * props.position + 'px',
    width: (props.end - props.start) + 'px',
    marginLeft: props.start + 'px',
    backgroundColor: '#f8f8f2',
    position: 'absolute',
  };
  return(
    <div style={style}>
    <p>{props.title}</p>
    </div>
  );
}

  export default Trial

