import { EventLoggingComponentProps, EventPath } from './types';
import { EVENT_VALUE } from '@/dataEvent';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const ViewEventLogging = <Path extends EventPath>({
  children,
  path,
  property,
}: EventLoggingComponentProps<Path>) => {
  const { event, eventPath } = EVENT_VALUE[path[0]][path[1]][path[2]];
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
        console.log('ViewEventLogging fire!');
        console.log('event', event);
        console.log('eventPath', eventPath);
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
