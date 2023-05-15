import { EventProperty } from '@/dataEvent';
import React from 'react';

type Path<T, TPath extends string[] = []> = TPath['length'] extends 4
  ? TPath
  : keyof T extends infer Key extends string
  ? Key extends keyof T
    ? Path<T[Key], [...TPath, Key]>
    : never
  : never;

export type EventPath = Path<EventProperty>;
type EventAction = 'click' | 'view';

type EventPropertyForPath<Path extends EventPath, Action extends EventAction> = Path extends [
  infer Feature,
  infer Type,
  infer Location,
  infer Target,
]
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
  : never;

export type EventLoggingComponentProps<Action extends EventAction> = {
  children: React.ReactElement;
  path: EventPath;
  property: EventPropertyForPath<EventPath, Action>;
};
