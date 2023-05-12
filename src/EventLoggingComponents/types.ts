import { EventProperty } from '@/dataEvent';
import React from 'react';

type Path<T, U extends any[] = []> = U['length'] extends 4
  ? U
  : keyof T extends infer K
  ? K extends keyof T
    ? Path<T[K], [...U, K]>
    : never
  : never;

export type EventPath = Path<EventProperty>;
type EventAction = 'click' | 'view';

type EventPropertyForPath<Path extends EventPath, Action extends EventAction> = Path extends infer P
  ? P extends [infer Feature, infer Type, infer Location, infer Target]
    ? Feature extends keyof EventProperty
      ? Type extends keyof EventProperty[Feature]
        ? Location extends keyof EventProperty[Feature][Type]
          ? Target extends keyof EventProperty[Feature][Type][Location]
            ? Action extends keyof EventProperty[Feature][Type][Location][Target]
              ? EventProperty[Feature][Type][Location][Target][Action]
              : never
            : never
          : never
        : never
      : never
    : never
  : never;

export type EventLoggingComponentProps<Action extends EventAction> = {
  children: React.ReactElement;
  path: EventPath;
  property: EventPropertyForPath<EventPath, Action>;
};
