import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { format, subMonths, parseISO, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Reports = () => {
  const {
    eggCollections,
    batches,
    feedConsumption,
    feedTypes,
    feedInventory,
    sales,
    products,
  } = useAppContext();
  
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('3m');
  
  // Get date range based on selection (e.g., 1m, 3m, 6m, 1y)
  const getDateRange = () => {
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '1m':
        startDate = subMonths(now, 1);
        break;
      case '3m':
        startDate = subMonths(now, 3);
        break;
      case '6m':
        startDate = subMonths(now, 6);
        break;
      case '1y':
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = subMonths(now, 3);
    }
    
    return { startDate, endDate: now };
  };
  
  // Helper function to filter data by date range
  const filterByDateRange = <T extends { date: string }>(data: T[]) => {
    const { startDate, endDate } = getDateRange();
    return data.filter(item => {
      const itemDate = parseISO(item.date);
      return isWithinInterval(itemDate, { start: startDate, end: endDate });
    });
  };
  
  // Helper to filter by both date range and batch if selected
  const filterByBatchAndDate = <T extends { date: string; batchId: string }>(data: T[]) => {
    const filtered = filterByDateRange(data);
    if (selectedBatch === 'all') return filtered;
    return filtered.filter(item => item.batchId === selectedBatch);
  };
  
  // Helper function to get batch name
  const getBatchName = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    return batch ? batch.name : 'Unknown';
  };
  
  // Helper function to get feed name
  const getFeedName = (feedId: string) => {
    const feed = feedTypes.find(f => f.id === feedId);
    return feed ? feed.name : 'Unknown';
  };
  
  // Helper function to generate monthly data
  const generateMonthlyData = <T extends { date: string }>(
    data: T[],
    valueExtractor: (item: T) => number
  ) => {
    const { startDate, endDate } = getDateRange();
    const result: { name: string; value: number }[] = [];
    
    let currentDate = startOfMonth(startDate);
    while (currentDate <= endDate) {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const monthName = format(currentDate, 'MMM yyyy');
      
      const monthItems = data.filter(item => {
        const itemDate = parseISO(item.date);
        return isWithinInterval(itemDate, { start: monthStart, end: monthEnd });
      });
      
      const value = monthItems.reduce((sum, item) => sum + valueExtractor(item), 0);
      
      result.push({
        name: monthName,
        value: value
      });
      
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    }
    
    return result;
  };
  
  // Egg production report data
  const getEggProductionReportData = () => {
    const filteredData = filterByBatchAndDate(eggCollections);
    
    return generateMonthlyData(
      filteredData,
      item => item.wholeCount + item.brokenCount
    );
  };
  
  // Daily egg production (last 30 days)
  const getDailyEggProductionData = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const filteredData = selectedBatch === 'all' 
      ? eggCollections.filter(e => parseISO(e.date) >= thirtyDaysAgo)
      : eggCollections.filter(e => e.batchId === selectedBatch && parseISO(e.date) >= thirtyDaysAgo);
      
    // Group by date
    const groupedByDate = filteredData.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = { whole: 0, broken: 0 };
      }
      acc[item.date].whole += item.wholeCount;
      acc[item.date].broken += item.brokenCount;
      return acc;
    }, {} as Record<string, { whole: number; broken: number }>);
    
    // Convert to array for chart
    return Object.entries(groupedByDate)
      .map(([date, counts]) => ({
        date: format(parseISO(date), 'MMM dd'),
        whole: counts.whole,
        broken: counts.broken,
        total: counts.whole + counts.broken,
      }))
      .sort((a, b) => {
        // Sort by date - Fixed the reference to date variables
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
  };
  
  // Feed consumption report data
  const getFeedConsumptionReportData = () => {
    const filteredData = filterByBatchAndDate(feedConsumption);
    
    // Group by feed type
    const groupedByFeed = filteredData.reduce((acc, item) => {
      const feedName = getFeedName(item.feedTypeId);
      if (!acc[feedName]) {
        acc[feedName] = 0;
      }
      acc[feedName] += item.quantityKg;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array for chart
    return Object.entries(groupedByFeed).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  // Sales report data
  const getSalesReportData = () => {
    const filteredSales = filterByDateRange(sales);
    
    return generateMonthlyData(
      filteredSales,
      item => item.totalAmount
    );
  };
  
  // Product sales breakdown
  const getProductSalesBreakdown = () => {
    const filteredSales = filterByDateRange(sales);
    
    // Flatten all products from all sales
    const allSoldProducts = filteredSales.flatMap(sale => sale.products);
    
    // Group by product ID
    const groupedByProduct = allSoldProducts.reduce((acc, item) => {
      const product = products.find(p => p.id === item.productId);
      const productName = product ? product.name : 'Unknown';
      
      if (!acc[productName]) {
        acc[productName] = {
          quantity: 0,
          revenue: 0
        };
      }
      
      acc[productName].quantity += item.quantity;
      acc[productName].revenue += item.quantity * item.pricePerUnit;
      
      return acc;
    }, {} as Record<string, { quantity: number; revenue: number }>);
    
    // Convert to array for chart
    return Object.entries(groupedByProduct).map(([name, data]) => ({
      name,
      quantity: data.quantity,
      revenue: data.revenue
    }));
  };
  
  // Batch wise egg production
  const getBatchWiseEggProduction = () => {
    const filteredData = filterByDateRange(eggCollections);
    
    // Group by batch
    const groupedByBatch = filteredData.reduce((acc, item) => {
      const batchName = getBatchName(item.batchId);
      
      if (!acc[batchName]) {
        acc[batchName] = {
          whole: 0,
          broken: 0
        };
      }
      
      acc[batchName].whole += item.wholeCount;
      acc[batchName].broken += item.brokenCount;
      
      return acc;
    }, {} as Record<string, { whole: number; broken: number }>);
    
    // Convert to array for chart
    return Object.entries(groupedByBatch).map(([name, counts]) => ({
      name,
      whole: counts.whole,
      broken: counts.broken,
      total: counts.whole + counts.broken
    }));
  };
  
  // Feed efficiency calculation (eggs per kg of feed)
  const calculateFeedEfficiency = () => {
    const filteredEggs = filterByBatchAndDate(eggCollections);
    const filteredFeed = filterByBatchAndDate(feedConsumption);
    
    // Total eggs
    const totalEggs = filteredEggs.reduce(
      (sum, item) => sum + item.wholeCount + item.brokenCount, 
      0
    );
    
    // Total feed
    const totalFeed = filteredFeed.reduce(
      (sum, item) => sum + item.quantityKg,
      0
    );
    
    return totalFeed > 0 ? (totalEggs / totalFeed).toFixed(2) : '0';
  };

  // Colors for charts
  const COLORS = ['#3c6c40', '#689d6a', '#8bb58b', '#b1cfb1', '#daeada'];
  
  // Prepare data for charts
  const eggProductionData = getEggProductionReportData();
  const dailyEggData = getDailyEggProductionData();
  const feedConsumptionData = getFeedConsumptionReportData();
  const salesData = getSalesReportData();
  const productSalesData = getProductSalesBreakdown();
  const batchWiseEggData = getBatchWiseEggProduction();
  const feedEfficiency = calculateFeedEfficiency();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <Label htmlFor="batch-filter">Batch</Label>
              <Select 
                onValueChange={setSelectedBatch}
                defaultValue="all"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {batches.map(batch => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/2">
              <Label htmlFor="time-filter">Time Range</Label>
              <Select 
                onValueChange={setTimeRange}
                defaultValue="3m"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Last Month</SelectItem>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Egg Production
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {eggProductionData.reduce((sum, item) => sum + item.value, 0)} eggs
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Feed Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedEfficiency} eggs/kg
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${salesData.reduce((sum, item) => sum + item.value, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="eggs" className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-4">
          <TabsTrigger value="eggs">Egg Production</TabsTrigger>
          <TabsTrigger value="feed">Feed Management</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="batches">Batch Performance</TabsTrigger>
        </TabsList>
        
        {/* Egg Production Tab */}
        <TabsContent value="eggs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Egg Production</CardTitle>
              <CardDescription>Total eggs produced per month</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={eggProductionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Eggs" fill="#3c6c40" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Daily Egg Production (Last 30 Days)</CardTitle>
              <CardDescription>Whole vs broken eggs collected daily</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailyEggData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="whole" name="Whole Eggs" stroke="#3c6c40" />
                  <Line type="monotone" dataKey="broken" name="Broken Eggs" stroke="#d14343" />
                  <Line type="monotone" dataKey="total" name="Total Eggs" stroke="#444" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Feed Management Tab */}
        <TabsContent value="feed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Feed Consumption by Type</CardTitle>
                <CardDescription>Total feed used by type (kg)</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={feedConsumptionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {feedConsumptionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} kg`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Feed Efficiency Analysis</CardTitle>
                <CardDescription>Eggs produced per kg of feed used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 flex flex-col items-center justify-center h-64">
                  <div className="text-6xl font-bold text-lusoi-500">{feedEfficiency}</div>
                  <div className="text-xl mt-2">eggs per kg of feed</div>
                  <p className="mt-4 text-center text-muted-foreground">
                    {parseFloat(feedEfficiency) > 10 
                      ? "Great efficiency! Your feed management is working well."
                      : parseFloat(feedEfficiency) > 5 
                      ? "Average efficiency. Consider optimizing feed management."
                      : "Low efficiency. Review feed quality and distribution."
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Feed Inventory vs. Consumption</CardTitle>
              <CardDescription>Track feed stock levels against usage</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={feedTypes.map(feed => {
                    const inventory = feedInventory
                      .filter(i => i.feedTypeId === feed.id)
                      .reduce((sum, item) => sum + item.quantityKg, 0);
                    
                    const consumption = feedConsumption
                      .filter(c => c.feedTypeId === feed.id)
                      .reduce((sum, item) => sum + item.quantityKg, 0);
                    
                    return {
                      name: feed.name,
                      inventory,
                      consumption
                    };
                  })}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="inventory" name="Inventory (kg)" fill="#3c6c40" />
                  <Bar dataKey="consumption" name="Consumed (kg)" fill="#b1cfb1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales</CardTitle>
              <CardDescription>Revenue generated each month</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                  <Bar dataKey="value" name="Sales" fill="#3c6c40" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Product Sales Breakdown</CardTitle>
              <CardDescription>Sales by product category</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productSalesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(value, name) => [
                    name === 'revenue' ? `$${value}` : value,
                    name === 'revenue' ? 'Revenue' : 'Quantity'
                  ]} />
                  <Legend />
                  <Bar dataKey="quantity" name="Quantity" fill="#8bb58b" />
                  <Bar dataKey="revenue" name="Revenue" fill="#3c6c40" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Batch Performance Tab */}
        <TabsContent value="batches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Batch-wise Egg Production</CardTitle>
              <CardDescription>Compare production across batches</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={batchWiseEggData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="whole" name="Whole Eggs" fill="#3c6c40" />
                  <Bar dataKey="broken" name="Broken Eggs" fill="#d14343" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Batch Performance Analysis</CardTitle>
              <CardDescription>Key metrics by batch</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Batch</th>
                    <th className="text-right py-2">Total Eggs</th>
                    <th className="text-right py-2">Broken %</th>
                    <th className="text-right py-2">Feed Used (kg)</th>
                    <th className="text-right py-2">Eggs/Bird/Day</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map(batch => {
                    const batchEggs = eggCollections.filter(e => e.batchId === batch.id);
                    const totalWhole = batchEggs.reduce((sum, egg) => sum + egg.wholeCount, 0);
                    const totalBroken = batchEggs.reduce((sum, egg) => sum + egg.brokenCount, 0);
                    const total = totalWhole + totalBroken;
                    const brokenPercent = total > 0 ? ((totalBroken / total) * 100).toFixed(1) : '0';
                    
                    const batchFeed = feedConsumption.filter(f => f.batchId === batch.id);
                    const totalFeed = batchFeed.reduce((sum, feed) => sum + feed.quantityKg, 0);
                    
                    // Calculate eggs per bird per day (if data available)
                    const uniqueDates = [...new Set(batchEggs.map(e => e.date))].length;
                    const eggsPerBirdDay = uniqueDates > 0 && batch.birdCount > 0
                      ? (total / (uniqueDates * batch.birdCount)).toFixed(1)
                      : '-';
                    
                    return (
                      <tr key={batch.id} className="border-b">
                        <td className="py-2">{batch.name}</td>
                        <td className="text-right">{total}</td>
                        <td className="text-right">{brokenPercent}%</td>
                        <td className="text-right">{totalFeed}</td>
                        <td className="text-right">{eggsPerBirdDay}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
