import React from 'react';
import { EVENT_NAME } from '@/dataEvent';
import { EventLoggingComponentProps, EventPath } from './types';

const ClickEventLogging = <Path extends EventPath>({
  children,
  path,
  property,
}: EventLoggingComponentProps<Path, 'click'>) => {
  const [feature, location, target] = path;
  const eventName = EVENT_NAME[feature][location][target]['click'];
  const eventPath = [feature, location, target].join(' > ');

  const child = React.Children.only(children);
  return React.cloneElement(child, {
    onClick: () => {
      /**
       * event logging!
       */
      console.log('---------------');
      console.log('Click Event Logging!');
      console.log('name', eventName);
      console.log('path', eventPath);
      console.log('property', property);

      if (child.props.onClick) {
        child.props.onClick();
      }
    },
  });
};

export default ClickEventLogging;
