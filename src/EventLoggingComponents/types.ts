import { EventProperty } from '@/dataEvent';

type EventPath<T, TPath extends string[] = []> = TPath['length'] extends 4
  ? TPath
  : keyof T extends infer Key extends string
  ? Key extends keyof T
    ? EventPath<T[Key], [...TPath, Key]>
    : never
  : never;

export type AllEventPath = EventPath<EventProperty>;

type EventAction = 'click' | 'view';

type EventPropertyForPath<Path, Action extends EventAction> = Path extends [
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

export type EventLoggingComponentProps<Path extends AllEventPath, Action extends EventAction> = {
  children: JSX.Element;
  path: Path;
  property: EventPropertyForPath<Path, Action>;
};
