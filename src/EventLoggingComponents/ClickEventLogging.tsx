import React from 'react';
import { EVENT_VALUE } from '@/dataEvent';
import { EventLoggingComponentProps, EventPath } from './types';

const ClickEventLogging = <Path extends EventPath>({
  children,
  path,
  property,
}: EventLoggingComponentProps<Path>) => {
  const { event, eventPath } = EVENT_VALUE[path[0]][path[1]][path[2]];

  const child = React.Children.only(children);
  return React.cloneElement(child, {
    onClick: () => {
      /**
       * event logging!
       */
      console.log('ClickEventLogging fire!');
      console.log('event', event);
      console.log('eventPath', eventPath);
      console.log('property', property);

      if (child.props.onClick) {
        child.props.onClick();
      }
    },
  });
};

export default ClickEventLogging;
