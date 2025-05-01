import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { Egg, Users, Utensils, Calendar, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { 
    batches, 
    eggCollections, 
    feedConsumption,
    vaccinationRecords
  } = useAppContext();

  // Calculate total birds across all batches
  const totalBirds = batches.reduce((sum, batch) => sum + batch.birdCount, 0);
  
  // Calculate total eggs collected today
  const today = new Date().toISOString().split('T')[0];
  const todayEggCollections = eggCollections.filter(collection => collection.date === today);
  const totalEggsToday = todayEggCollections.reduce((sum, collection) => 
    sum + collection.wholeCount + collection.brokenCount, 0);
  
  // Calculate egg collection rate
  const layingBatches = batches.filter(batch => batch.batchStatus === 'Laying');
  const totalLayingBirds = layingBatches.reduce((sum, batch) => sum + batch.birdCount, 0);
  const eggRate = totalLayingBirds ? (totalEggsToday / totalLayingBirds * 100).toFixed(1) : 0;
  
  // Get upcoming vaccinations (next 7 days)
  const currentDate = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(currentDate.getDate() + 7);
  
  const upcomingVaccinations = vaccinationRecords
    .filter(record => {
      if (!record.nextScheduledDate) return false;
      const nextDate = new Date(record.nextScheduledDate);
      return nextDate >= currentDate && nextDate <= nextWeek;
    })
    .map(record => {
      const batch = batches.find(b => b.id === record.batchId);
      // Use the vaccine field name that's actually in the record
      return {
        ...record,
        batchName: batch?.name || 'Unknown Batch',
        vaccineName: record.vaccineId || 'Unknown Vaccine'
      };
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-600 bg-white px-3 py-1 rounded-md border shadow-sm">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          })}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{batches.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalBirds} birds in total
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Eggs</CardTitle>
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Egg className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalEggsToday}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {eggRate}% laying rate
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feed Used Today</CardTitle>
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Utensils className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {feedConsumption
                .filter(feed => feed.date === today)
                .reduce((sum, feed) => sum + feed.quantityKg, 0)} kg
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {feedConsumption.filter(feed => feed.date === today).length} feedings
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Laying Batches</CardTitle>
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Egg className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {batches.filter(batch => batch.batchStatus === 'Laying').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of {batches.length} total batches
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Production Overview</CardTitle>
            <CardDescription>
              Daily egg production for the past 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-muted-foreground">Production chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center">
            <div>
              <CardTitle>Upcoming Vaccinations</CardTitle>
              <CardDescription>Next 7 days</CardDescription>
            </div>
            <Calendar className="ml-auto h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            {upcomingVaccinations.length > 0 ? (
              <ul className="space-y-3">
                {upcomingVaccinations.map(vacc => (
                  <li key={vacc.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{vacc.batchName}</p>
                      <p className="text-muted-foreground text-xs">
                        Due on {new Date(vacc.nextScheduledDate || '').toLocaleDateString()}
                      </p>
                      <p className="text-xs mt-1">{vacc.vaccineName}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-gray-100 p-3 mb-3">
                  <Calendar className="h-6 w-6 text-gray-500" />
                </div>
                <p className="text-sm text-muted-foreground">No upcoming vaccinations.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
