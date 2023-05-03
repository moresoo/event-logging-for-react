import { EventProperty } from '@/dataEvent';
import React from 'react';

type Path<T, U extends any[] = []> = U['length'] extends 3
  ? U
  : keyof T extends infer K
  ? K extends keyof T
    ? Path<T[K], [...U, K]>
    : never
  : never;

export type EventPath = Path<EventProperty>;
type EventAction = 'click' | 'view';

type EventPropertyForPath<Path extends EventPath, Action extends EventAction> = Path extends infer P
  ? P extends [infer Feature, infer Location, infer Target]
    ? Feature extends keyof EventProperty
      ? Location extends keyof EventProperty[Feature]
        ? Target extends keyof EventProperty[Feature][Location]
          ? Action extends keyof EventProperty[Feature][Location][Target]
            ? EventProperty[Feature][Location][Target][Action]
            : never
          : never
        : never
      : never
    : never
  : never;

export type EventLoggingComponentProps<Path extends EventPath, Action extends EventAction> = {
  children: React.ReactElement;
  path: Path;
  property: EventPropertyForPath<Path, Action>;
};
