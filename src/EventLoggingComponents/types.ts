import { EventProperty, EVENT_NAME } from '@/dataEvent';

type EventPath<T, TPath extends string[] = []> = TPath['length'] extends 4
  ? TPath
  : keyof T extends infer Key extends string
  ? Key extends keyof T
    ? EventPath<T[Key], [...TPath, Key]>
    : never
  : never;

export type AllEventPath = EventPath<typeof EVENT_NAME>;

type EventAction = 'click' | 'view';

type EventPropertyForPath<Path, Action extends EventAction> = Path extends [
  infer Feature,
  infer Page,
  infer At,
  infer Target,
]
  ? Feature extends keyof EventProperty
    ? Page extends keyof EventProperty[Feature]
      ? At extends keyof EventProperty[Feature][Page]
        ? Target extends keyof EventProperty[Feature][Page][At]
          ? Action extends keyof EventProperty[Feature][Page][At][Target]
            ? EventProperty[Feature][Page][At][Target][Action]
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
