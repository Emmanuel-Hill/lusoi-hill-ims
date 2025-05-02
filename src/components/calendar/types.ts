
export type EventType = 'egg-collection' | 'feed' | 'vaccination' | 'sale';

export interface CalendarEvent {
  date: Date;
  type: EventType;
  title: string;
  detail: string;
}
