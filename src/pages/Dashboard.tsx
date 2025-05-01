
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
      return {
        ...record,
        batchName: batch?.name || 'Unknown Batch'
      };
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-lusoi-800">Dashboard</h1>
        <p className="text-sm text-muted-foreground bg-white px-3 py-1 rounded-full border shadow-sm">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          })}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-t-4 border-t-lusoi-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <div className="h-8 w-8 rounded-full bg-lusoi-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-lusoi-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-lusoi-800">{batches.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalBirds} birds in total
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-t-4 border-t-amber-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Eggs</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Egg className="h-4 w-4 text-amber-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-800">{totalEggsToday}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {eggRate}% laying rate
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-t-4 border-t-emerald-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feed Used Today</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <Utensils className="h-4 w-4 text-emerald-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-800">
              {feedConsumption
                .filter(feed => feed.date === today)
                .reduce((sum, feed) => sum + feed.quantityKg, 0)} kg
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {feedConsumption.filter(feed => feed.date === today).length} feedings
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-t-4 border-t-purple-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Laying Batches</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Egg className="h-4 w-4 text-purple-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-800">
              {batches.filter(batch => batch.batchStatus === 'Laying').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of {batches.length} total batches
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-2 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-lusoi-800">Production Overview</CardTitle>
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

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center">
            <div>
              <CardTitle className="text-lg text-lusoi-800">Upcoming Vaccinations</CardTitle>
              <CardDescription>Next 7 days</CardDescription>
            </div>
            <Calendar className="ml-auto h-5 w-5 text-lusoi-600" />
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            {upcomingVaccinations.length > 0 ? (
              <ul className="space-y-3">
                {upcomingVaccinations.map(vacc => (
                  <li key={vacc.id} className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-amber-800">{vacc.batchName}</p>
                      <p className="text-muted-foreground text-xs">
                        Due on {new Date(vacc.nextScheduledDate || '').toLocaleDateString()}
                      </p>
                      <p className="text-xs mt-1 text-amber-700">{vacc.vaccineName}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-green-100 p-3 mb-3">
                  <Calendar className="h-6 w-6 text-green-600" />
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
