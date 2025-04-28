import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import {
  FileText,
  File,
  Download
} from 'lucide-react';
import {
  generateBatchReport,
  generateEggCollectionReport,
  generateFeedManagementReport,
  generateVaccinationReport,
  generateSalesReport,
  generateCustomerReport
} from '@/utils/reportGenerator';

type ReportCategory = 'batches' | 'eggs' | 'feed' | 'vaccination' | 'sales' | 'customers';
type ReportFormat = 'excel' | 'pdf';

const ReportGenerator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<ReportCategory>('batches');
  const [format, setFormat] = useState<ReportFormat>('excel');

  const {
    batches,
    eggCollections,
    feedConsumption,
    feedInventory,
    feedTypes,
    vaccinationRecords,
    vaccines,
    sales,
    products,
    customers,
    orders
  } = useAppContext();

  const handleGenerateReport = () => {
    try {
      // Choose report generator based on selected category
      switch (category) {
        case 'batches':
          generateBatchReport(batches, format);
          break;
        case 'eggs':
          generateEggCollectionReport(eggCollections, batches, format);
          break;
        case 'feed':
          generateFeedManagementReport(feedConsumption, feedInventory, feedTypes, batches, format);
          break;
        case 'vaccination':
          generateVaccinationReport(vaccinationRecords, vaccines, batches, format);
          break;
        case 'sales':
          generateSalesReport(sales, products, customers, format);
          break;
        case 'customers':
          generateCustomerReport(customers, sales, orders, format);
          break;
      }
      
      setIsOpen(false);
      toast.success(`${getCategoryName(category)} report generated successfully`);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report. Please try again.");
    }
  };
  
  const getCategoryName = (cat: ReportCategory): string => {
    switch (cat) {
      case 'batches': return 'Batches';
      case 'eggs': return 'Egg Collection';
      case 'feed': return 'Feed Management';
      case 'vaccination': return 'Vaccination';
      case 'sales': return 'Sales';
      case 'customers': return 'Customers';
      default: return 'Report';
    }
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>
              Select the type of report and format you want to generate.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select 
                value={category} 
                onValueChange={(value) => setCategory(value as ReportCategory)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="batches">Batches</SelectItem>
                  <SelectItem value="eggs">Egg Collection</SelectItem>
                  <SelectItem value="feed">Feed Management</SelectItem>
                  <SelectItem value="vaccination">Vaccination</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="format" className="text-right">Format</Label>
              <div className="col-span-3 flex items-center gap-4">
                <Button
                  type="button"
                  variant={format === 'excel' ? 'default' : 'outline'}
                  className="flex-1 gap-2"
                  onClick={() => setFormat('excel')}
                >
                  <File className="h-4 w-4" />
                  Excel
                </Button>
                <Button
                  type="button"
                  variant={format === 'pdf' ? 'default' : 'outline'}
                  className="flex-1 gap-2"
                  onClick={() => setFormat('pdf')}
                >
                  <FileText className="h-4 w-4" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={handleGenerateReport}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportGenerator;
