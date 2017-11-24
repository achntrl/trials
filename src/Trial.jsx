import React, { Component } from 'react';

const Trial = (props) => {
  const style = {
    height: '250px',
    width: (props.end - props.start) + 'px',
    marginLeft: props.start + 'px',
    backgroundColor: 'white'
  };
  return(
    <div style={style}>
    </div>
  );
}

  export default Trial

