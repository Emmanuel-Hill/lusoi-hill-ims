
import { CalendarEvent } from './types';

// Generate calendar events from application data
export const generateEvents = (
  eggCollections: any[],
  feedConsumption: any[],
  vaccinationRecords: any[],
  sales: any[],
  feedTypes: any[],
  vaccines: any[]
): CalendarEvent[] => {
  const events: CalendarEvent[] = [];

  // Add egg collections to events
  eggCollections.forEach(collection => {
    events.push({
      date: new Date(collection.date),
      type: 'egg-collection',
      title: 'Egg Collection',
      detail: `Collected ${collection.wholeCount + collection.brokenCount} eggs`
    });
  });

  // Add feed consumption to events
  feedConsumption.forEach(feed => {
    const feedType = feedTypes.find(f => f.id === feed.feedTypeId);
    events.push({
      date: new Date(feed.date),
      type: 'feed',
      title: 'Feed',
      detail: `${feed.quantityKg}kg of ${feedType?.name || 'feed'}`
    });
  });

  // Add vaccinations to events
  vaccinationRecords.forEach(record => {
    const vaccine = vaccines.find(v => v.id === record.vaccineId);
    events.push({
      date: new Date(record.date),
      type: 'vaccination',
      title: 'Vaccination',
      detail: `${vaccine?.name || 'Vaccine'} administered`
    });
  });

  // Add sales to events
  sales.forEach(sale => {
    events.push({
      date: new Date(sale.date),
      type: 'sale',
      title: 'Sale',
      detail: `$${sale.totalAmount.toFixed(2)} sale`
    });
  });

  return events;
};
