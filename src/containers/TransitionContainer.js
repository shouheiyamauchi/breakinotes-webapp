import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const TransitionContainer = props => {
  return (
    <div className="page">
      <ReactCSSTransitionGroup
        transitionAppear={true}
        transitionAppearTimeout={600}
        transitionEnterTimeout={600}
        transitionLeaveTimeout={200}
        transitionName={'SlideIn'}
      >
        {props.children}
      </ReactCSSTransitionGroup>
    </div>
  );
};

export default TransitionContainer;
