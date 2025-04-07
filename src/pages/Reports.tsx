
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ReportGenerator from '@/components/ReportGenerator';
import { FileText, FileSpreadsheet, FilePdf, BarChart, PieChart } from 'lucide-react';

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <ReportGenerator />
      </div>
      
      {/* Reports Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Detailed Reports</CardTitle>
          <CardDescription>
            Export comprehensive data reports in Excel or PDF format for your records and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-green-50/50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                  Excel Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Export data to Excel spreadsheets for further analysis, filtering, and manipulation
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-center gap-1">
                    <BarChart className="h-3.5 w-3.5 text-green-600" />
                    Create pivot tables and charts
                  </li>
                  <li className="flex items-center gap-1">
                    <BarChart className="h-3.5 w-3.5 text-green-600" />
                    Filter and sort data dynamically
                  </li>
                  <li className="flex items-center gap-1">
                    <BarChart className="h-3.5 w-3.5 text-green-600" />
                    Perform custom calculations
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50/50 border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FilePdf className="h-5 w-5 text-orange-600" />
                  PDF Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate professional PDF reports for sharing with stakeholders or printing
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-center gap-1">
                    <BarChart className="h-3.5 w-3.5 text-orange-600" />
                    Clean, formatted tables
                  </li>
                  <li className="flex items-center gap-1">
                    <BarChart className="h-3.5 w-3.5 text-orange-600" />
                    Ready for presentation
                  </li>
                  <li className="flex items-center gap-1">
                    <BarChart className="h-3.5 w-3.5 text-orange-600" />
                    Print-friendly format
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50/50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Available Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Reports available for all major farm management areas
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-center gap-1">
                    <PieChart className="h-3.5 w-3.5 text-blue-600" />
                    Batches, Egg Collection, Feed
                  </li>
                  <li className="flex items-center gap-1">
                    <PieChart className="h-3.5 w-3.5 text-blue-600" />
                    Vaccination Records
                  </li>
                  <li className="flex items-center gap-1">
                    <PieChart className="h-3.5 w-3.5 text-blue-600" />
                    Sales and Customer Data
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 bg-muted/30 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Why Generate Reports?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1">Decision Making</h4>
                <p className="text-sm text-muted-foreground">
                  Export detailed farm data to help make informed decisions about your poultry operation. 
                  Compare batch performance, track feed efficiency, and analyze sales trends.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Documentation & Compliance</h4>
                <p className="text-sm text-muted-foreground">
                  Maintain accurate records for regulatory compliance, business planning, and historical documentation.
                  Generate reports on demand for farm audits or stakeholder meetings.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Generate Reports</CardTitle>
          <CardDescription>
            Follow these simple steps to create detailed reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex items-start gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-medium">1</div>
              <div>
                <h4 className="font-medium">Click "Generate Report" button</h4>
                <p className="text-sm text-muted-foreground">Use the button in the top-right corner of this page</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-medium">2</div>
              <div>
                <h4 className="font-medium">Select Report Category</h4>
                <p className="text-sm text-muted-foreground">Choose from Batches, Egg Collection, Feed Management, Vaccination, Sales, or Customers</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-medium">3</div>
              <div>
                <h4 className="font-medium">Choose Output Format</h4>
                <p className="text-sm text-muted-foreground">Select either Excel format (for data analysis) or PDF format (for printing and presentation)</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-medium">4</div>
              <div>
                <h4 className="font-medium">Click "Generate"</h4>
                <p className="text-sm text-muted-foreground">The report will be created and downloaded to your device automatically</p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
