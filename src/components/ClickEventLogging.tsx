import React from 'react';
import { EventProperty, EVENT_VALUE } from '@/dataEvent';

type Path<T, U extends any[] = []> = U['length'] extends 3
  ? U
  : keyof T extends infer K
  ? K extends keyof T
    ? Path<T[K], [...U, K]>
    : never
  : never;

type EventPath = Path<EventProperty>;

type EventPropertyForPath<Path extends EventPath> = Path extends [infer K1, infer K2, infer K3]
  ? K1 extends keyof EventProperty
    ? K2 extends keyof EventProperty[K1]
      ? K3 extends keyof EventProperty[K1][K2]
        ? EventProperty[K1][K2][K3]
        : never
      : never
    : never
  : never;

export const ClickEventLogging = <Path extends EventPath>({
  children,
  path,
  property,
}: {
  children: React.ReactElement;
  path: Path;
  property: EventPropertyForPath<Path>;
}) => {
  const { event, eventPath } = EVENT_VALUE[path[0]][path[1]][path[2]];

  const child = React.Children.only(children);
  return React.cloneElement(child, {
    onClick: () => {
      if (child.props.onClick) {
        /**
         * event logging!
         */
        console.log('ClickEventLogging fire!');
        console.log('event', event);
        console.log('eventPath', eventPath);
        console.log('property', property);

        child.props.onClick();
      }
    },
  });
};
