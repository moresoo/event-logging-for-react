import { EventLoggingComponentProps, EventPath } from './types';
import { EVENT_NAME } from '@/dataEvent';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const isInViewport = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const ViewEventLogging = <Path extends EventPath>({
  children,
  path,
  property,
}: EventLoggingComponentProps<Path, 'view'>) => {
  const [feature, location, target] = path;
  const eventName = EVENT_NAME[feature][location][target]['view'];
  const eventPath = [feature, location, target].join(' > ');

  const ref = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);

  const handleVisibilityChange = useCallback(() => {
    if (!isVisibleRef.current && ref.current && isInViewport(ref.current)) {
      isVisibleRef.current = true;
      window.removeEventListener('scroll', handleVisibilityChange);
      /**
       * event logging!
       */
      console.log('---------------');
      console.log('View Event Logging!');
      console.log('name', eventName);
      console.log('path', eventPath);
      console.log('property', property);
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
