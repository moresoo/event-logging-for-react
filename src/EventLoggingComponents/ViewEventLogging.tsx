import { AllEventPath, EventLoggingComponentProps } from './types';
import { EVENT_NAME } from '@/dataEvent';
import React, { useCallback, useEffect, useRef } from 'react';

const isInViewport = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const ViewEventLogging = <Path extends AllEventPath>({
  children,
  path,
  property,
}: EventLoggingComponentProps<Path, 'view'>) => {
  const [feature, page, at, target] = path;
  const eventName = (EVENT_NAME as any)[feature][page][at][target]['view'];
  const eventPath = [feature, page, at, target].join(' > ');

  const ref = useRef<HTMLDivElement>(null);
  const isViewedRef = useRef(false);

  const handleVisibilityChange = useCallback(() => {
    if (!isViewedRef.current && ref.current && isInViewport(ref.current)) {
      isViewedRef.current = true;
      window.removeEventListener('scroll', handleVisibilityChange);
      /**
       * event logging!
       */
      console.log('---------------');
      console.log('View Event Logging!');
      console.log('eventName: ', eventName);
      console.log('eventPath: ', eventPath);
      console.log('property: ', property);
    }
  }, [eventName, eventPath, property]);

  useEffect(() => {
    handleVisibilityChange();
    window.addEventListener('scroll', handleVisibilityChange);
    return () => window.removeEventListener('scroll', handleVisibilityChange);
  }, [handleVisibilityChange]);

  const child = React.Children.only(children);
  return React.cloneElement(child, {
    ref,
  });
};

export default ViewEventLogging;
