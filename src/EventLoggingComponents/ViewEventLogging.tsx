import { EventLoggingComponentProps, EventPath } from './types';
import { EVENT_NAME } from '@/dataEvent';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const ViewEventLogging = <Path extends EventPath>({
  children,
  path,
  property,
}: EventLoggingComponentProps<Path>) => {
  const [feature, location, target] = path;
  const eventName = EVENT_NAME[feature][location][target]['view'];
  const eventPath = [feature, location, target].join(' > ');

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleVisibilityChange = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const newIsVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (newIsVisible && !isVisible) {
        setIsVisible(true);
        /**
         * event logging!
         */
        console.log('---------------')
        console.log('View Event Logging!');
        console.log('name', eventName);
        console.log('path', eventPath);
        console.log('property', property);
      }
    }
  }, [isVisible, event, eventPath, property]);

  useEffect(() => {
    handleVisibilityChange(); // initial visibility check
    window.addEventListener('scroll', handleVisibilityChange);
    return () => window.removeEventListener('scroll', handleVisibilityChange);
  }, [handleVisibilityChange]);

  const child = React.Children.only(children);
  return React.cloneElement(child, {
    ref,
  });
};

export default ViewEventLogging;
