
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileSpreadsheet, FilePdf } from 'lucide-react';
import { toast } from 'sonner';

interface ReportButtonProps {
  onExcelExport: () => void;
  onPdfExport: () => void;
}

const ReportButton = ({ onExcelExport, onPdfExport }: ReportButtonProps) => {
  const handleExcelExport = () => {
    try {
      onExcelExport();
      toast.success('Excel report generated successfully');
    } catch (error) {
      console.error('Error generating Excel report:', error);
      toast.error('Failed to generate Excel report');
    }
  };

  const handlePdfExport = () => {
    try {
      onPdfExport();
      toast.success('PDF report generated successfully');
    } catch (error) {
      console.error('Error generating PDF report:', error);
      toast.error('Failed to generate PDF report');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Reports
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleExcelExport}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export to Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePdfExport}>
          <FilePdf className="mr-2 h-4 w-4" />
          Export to PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReportButton;
