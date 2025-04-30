import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { generateSalesReport } from '@/utils/reportGenerator';
import ReportButton from '@/components/ReportButton';
import ProductsList from '@/components/sales/ProductsList';
import SalesList from '@/components/sales/SalesList';
import ProductForm from '@/components/sales/ProductForm';
import BatchProductForm from '@/components/sales/BatchProductForm';
import PriceUpdateForm from '@/components/sales/PriceUpdateForm';
import SaleForm from '@/components/sales/SaleForm';
import { formatCurrency } from '@/utils/currencyUtils';

const Sales = () => {
  const {
    products,
    addProduct,
    updateProductPrice,
    sales,
    addSale,
    customers,
    batches
  } = useAppContext();

  // Product Dialog State
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isEditPriceDialogOpen, setIsEditPriceDialogOpen] = useState(false);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [isAddRetiredBatchDialogOpen, setIsAddRetiredBatchDialogOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    type: 'Egg' as 'Egg' | 'Bird',
    condition: 'Whole' as 'Whole' | 'Broken' | 'NA',
    currentPrice: 0,
  });
  
  // Retired batch product form
  const [batchProductForm, setBatchProductForm] = useState({
    batchId: '',
    name: '',
    currentPrice: 0,
  });
  
  // Get retired batches that can be sold
  const retiredBatches = batches.filter(batch => batch.batchStatus === 'Retired');
  
  // Sales Form State
  const [saleForm, setSaleForm] = useState({
    date: new Date().toISOString().split('T')[0],
    customerId: '',
    products: [] as { productId: string; quantity: number; pricePerUnit: number }[],
    totalAmount: 0,
    notes: '',
  });
  
  // Temporary state for adding products to a sale
  const [saleProduct, setSaleProduct] = useState({
    productId: '',
    quantity: 1,
  });
  
  // Dialog for updating product price
  const [priceForm, setPriceForm] = useState({
    productId: '',
    newPrice: 0,
  });

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductForm({
      ...productForm,
      [name]: name === 'currentPrice' ? parseFloat(value) : value,
    });
  };

  const handleProductTypeChange = (value: 'Egg' | 'Bird') => {
    setProductForm({
      ...productForm,
      type: value,
      condition: value === 'Bird' ? 'NA' : 'Whole',
    });
  };

  const handleProductConditionChange = (value: 'Whole' | 'Broken' | 'NA') => {
    setProductForm({
      ...productForm,
      condition: value,
    });
  };

  const handleAddProduct = () => {
    if (!productForm.name || productForm.currentPrice <= 0) {
      toast.error('Please enter a product name and valid price');
      return;
    }

    // Add priceUpdatedAt field to match the Product type requirements
    const productData = {
      id: crypto.randomUUID(),
      ...productForm,
      priceUpdatedAt: new Date().toISOString().split('T')[0]
    };

    addProduct(productData);
    setProductForm({
      name: '',
      type: 'Egg',
      condition: 'Whole',
      currentPrice: 0,
    });
    setIsProductDialogOpen(false);
    toast.success('Product added successfully');
  };
  
  // Handle retired batch selection to create product
  const handleBatchSelect = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    if (batch) {
      setBatchProductForm({
        batchId: batch.id,
        name: `${batch.name} (ExLayer Birds)`,
        currentPrice: 0,
      });
    }
  };
  
  // Handle batch product price change
  const handleBatchProductPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBatchProductForm({
      ...batchProductForm,
      currentPrice: parseFloat(e.target.value) || 0,
    });
  };
  
  // Add batch product to product list
  const handleAddBatchProduct = () => {
    if (!batchProductForm.batchId || batchProductForm.currentPrice <= 0) {
      toast.error('Please select a batch and enter a valid price');
      return;
    }
    
    // Create a new product from the batch
    addProduct({
      id: crypto.randomUUID(),
      name: batchProductForm.name,
      type: 'Bird',
      condition: 'NA',
      currentPrice: batchProductForm.currentPrice,
      priceUpdatedAt: new Date().toISOString().split('T')[0]
    });
    
    // Reset form
    setBatchProductForm({
      batchId: '',
      name: '',
      currentPrice: 0,
    });
    
    setIsAddRetiredBatchDialogOpen(false);
    toast.success('ExLayer birds added to products successfully');
  };

  const handleEditPriceClick = (product: any) => {
    setPriceForm({
      productId: product.id,
      newPrice: product.currentPrice,
    });
    setIsEditPriceDialogOpen(true);
  };

  const handlePriceUpdate = () => {
    if (priceForm.newPrice <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    updateProductPrice(priceForm.productId, priceForm.newPrice);
    setIsEditPriceDialogOpen(false);
    toast.success('Price updated successfully');
  };

  const handleSelectSaleProduct = (productId: string) => {
    const selectedProduct = products.find(p => p.id === productId);
    if (selectedProduct) {
      setSaleProduct({
        ...saleProduct,
        productId,
      });
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaleProduct({
      ...saleProduct,
      quantity: parseInt(e.target.value) || 0,
    });
  };

  const handleAddToSale = () => {
    if (!saleProduct.productId || saleProduct.quantity <= 0) {
      toast.error('Please select a product and enter a valid quantity');
      return;
    }

    const product = products.find(p => p.id === saleProduct.productId);
    if (!product) {
      toast.error('Product not found');
      return;
    }

    // Check if product already exists in the sale
    const existingProductIndex = saleForm.products.findIndex(p => p.productId === saleProduct.productId);

    if (existingProductIndex >= 0) {
      // Update existing product
      const updatedProducts = [...saleForm.products];
      updatedProducts[existingProductIndex].quantity += saleProduct.quantity;
      
      const updatedTotalAmount = updatedProducts.reduce(
        (sum, item) => sum + (item.quantity * item.pricePerUnit), 0
      );

      setSaleForm({
        ...saleForm,
        products: updatedProducts,
        totalAmount: updatedTotalAmount,
      });
    } else {
      // Add new product
      const newProduct = {
        productId: saleProduct.productId,
        quantity: saleProduct.quantity,
        pricePerUnit: product.currentPrice,
      };

      const newTotalAmount = saleForm.totalAmount + (newProduct.quantity * newProduct.pricePerUnit);

      setSaleForm({
        ...saleForm,
        products: [...saleForm.products, newProduct],
        totalAmount: newTotalAmount,
      });
    }

    // Reset sale product form
    setSaleProduct({
      productId: '',
      quantity: 1,
    });
  };

  const removeProductFromSale = (productId: string) => {
    const productToRemove = saleForm.products.find(p => p.productId === productId);
    if (!productToRemove) return;

    const newTotalAmount = saleForm.totalAmount - (productToRemove.quantity * productToRemove.pricePerUnit);

    setSaleForm({
      ...saleForm,
      products: saleForm.products.filter(p => p.productId !== productId),
      totalAmount: newTotalAmount,
    });
  };

  const handleSaleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSaleForm({
      ...saleForm,
      [name]: value,
    });
  };

  const handleSubmitSale = () => {
    if (saleForm.products.length === 0) {
      toast.error('Please add at least one product to the sale');
      return;
    }

    addSale({
      id: crypto.randomUUID(),
      date: saleForm.date,
      customerId: saleForm.customerId,
      products: saleForm.products,
      totalAmount: saleForm.totalAmount,
      notes: saleForm.notes,
    });
    setSaleForm({
      date: new Date().toISOString().split('T')[0],
      customerId: '',
      products: [],
      totalAmount: 0,
      notes: '',
    });
    setIsSaleDialogOpen(false);
    toast.success('Sale recorded successfully');
  };

  // Calculate daily and monthly sales
  const getDailySales = () => {
    const today = new Date().toISOString().split('T')[0];
    const dailySales = sales.filter(sale => sale.date === today);
    return {
      count: dailySales.length,
      total: dailySales.reduce((sum, sale) => sum + sale.totalAmount, 0)
    };
  };

  const getMonthlySales = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlySales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });
    return {
      count: monthlySales.length,
      total: monthlySales.reduce((sum, sale) => sum + sale.totalAmount, 0)
    };
  };

  const dailySales = getDailySales();
  const monthlySales = getMonthlySales();

  // Add report generation handler
  const handleGenerateReport = (format: 'excel' | 'pdf') => {
    try {
      generateSalesReport(sales, products, customers, format);
      toast.success(`Sales report generated successfully (${format.toUpperCase()})`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Sales Management</h1>

      {/* Sales Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailySales.count} sales</div>
            <p className="text-xs text-muted-foreground">Total: {formatCurrency(dailySales.total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlySales.count} sales</div>
            <p className="text-xs text-muted-foreground">Total: {formatCurrency(monthlySales.total)}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <ReportButton 
          onExcelExport={() => handleGenerateReport('excel')} 
          onPdfExport={() => handleGenerateReport('pdf')} 
        />
      </div>
      
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>
        
        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-end space-x-2">
            <Dialog open={isAddRetiredBatchDialogOpen} onOpenChange={setIsAddRetiredBatchDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add ExLayer Birds
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add ExLayer Birds as Product</DialogTitle>
                  <DialogDescription>
                    Add retired batches of birds to your product list for sale.
                  </DialogDescription>
                </DialogHeader>
                <BatchProductForm
                  batchProductForm={batchProductForm}
                  retiredBatches={retiredBatches}
                  onBatchSelect={handleBatchSelect}
                  onPriceChange={handleBatchProductPriceChange}
                  onSubmit={handleAddBatchProduct}
                  onCancel={() => setIsAddRetiredBatchDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Add a new product to your inventory.
                  </DialogDescription>
                </DialogHeader>
                <ProductForm
                  productForm={productForm}
                  onInputChange={handleProductChange}
                  onTypeChange={handleProductTypeChange}
                  onConditionChange={handleProductConditionChange}
                  onSubmit={handleAddProduct}
                  onCancel={() => setIsProductDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your product catalog and prices</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductsList 
                products={products} 
                onEditPrice={handleEditPriceClick}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isSaleDialogOpen} onOpenChange={setIsSaleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Record Sale
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Record New Sale</DialogTitle>
                  <DialogDescription>
                    Add a new sales transaction.
                  </DialogDescription>
                </DialogHeader>
                <SaleForm
                  saleForm={saleForm}
                  saleProduct={saleProduct}
                  products={products}
                  customers={customers}
                  onSaleFormChange={handleSaleFormChange}
                  onCustomerChange={(value) => setSaleForm({...saleForm, customerId: value})}
                  onProductSelect={handleSelectSaleProduct}
                  onQuantityChange={handleQuantityChange}
                  onAddToSale={handleAddToSale}
                  onRemoveProduct={removeProductFromSale}
                  onSubmit={handleSubmitSale}
                  onCancel={() => setIsSaleDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>All recorded sales transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesList 
                sales={sales} 
                products={products} 
                customers={customers} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog for updating product price */}
      <Dialog open={isEditPriceDialogOpen} onOpenChange={setIsEditPriceDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Product Price</DialogTitle>
            <DialogDescription>
              Change the price for this product.
            </DialogDescription>
          </DialogHeader>
          <PriceUpdateForm
            newPrice={priceForm.newPrice}
            onPriceChange={(e) => setPriceForm({...priceForm, newPrice: parseFloat(e.target.value) || 0})}
            onSubmit={handlePriceUpdate}
            onCancel={() => setIsEditPriceDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sales;
