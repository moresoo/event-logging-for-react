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

type EventPropertyForPath<Path extends EventPath> = Path extends [infer K1, infer K2, infer K3]
  ? K1 extends keyof EventProperty
    ? K2 extends keyof EventProperty[K1]
      ? K3 extends keyof EventProperty[K1][K2]
        ? EventProperty[K1][K2][K3]
        : never
      : never
    : never
  : never;

export type EventLoggingComponentProps<Path extends EventPath> = {
  children: React.ReactElement;
  path: Path;
  property: EventPropertyForPath<Path>;
};
