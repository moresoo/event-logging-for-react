import React from 'react';
import { EVENT_NAME } from '@/dataEvent';
import { AllEventPath, EventLoggingComponentProps } from './types';

const ClickEventLogging = <Path extends AllEventPath>({
  children,
  path,
  property,
}: EventLoggingComponentProps<Path, 'click'>) => {
  const [feature, type, location, target] = path;
  const eventName = (EVENT_NAME as any)[feature][type][location][target]['click'];
  const eventPath = [feature, type, location, target].join(' > ');

  const child = React.Children.only(children);
  return React.cloneElement(child, {
    onClick: () => {
      /**
       * event logging!
       */
      console.log('---------------');
      console.log('Click Event Logging!');
      console.log('eventName:', eventName);
      console.log('eventPath:', eventPath);
      console.log('property:', property);

      if (child.props.onClick) {
        child.props.onClick();
      }
    },
  });
};

export default ClickEventLogging;
