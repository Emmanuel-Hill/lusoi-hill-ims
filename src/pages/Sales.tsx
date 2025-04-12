
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { generateSalesReport } from '@/utils/reportGenerator';
import ReportButton from '@/components/ReportButton';
import ProductsList from '@/components/sales/ProductsList';
import SalesList from '@/components/sales/SalesList';
import SaleItemsList from '@/components/sales/SaleItemsList';

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

    addSale(saleForm);
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
            <p className="text-xs text-muted-foreground">Total: ${dailySales.total.toFixed(2)}</p>
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
            <p className="text-xs text-muted-foreground">Total: ${monthlySales.total.toFixed(2)}</p>
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
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="batch" className="text-right">
                      Batch
                    </Label>
                    <Select onValueChange={handleBatchSelect}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select retired batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {retiredBatches.length > 0 ? (
                          retiredBatches.map((batch) => (
                            <SelectItem key={batch.id} value={batch.id}>
                              {batch.name} ({batch.birdCount} birds)
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No retired batches available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="batchProductName" className="text-right">
                      Product Name
                    </Label>
                    <Input
                      id="batchProductName"
                      value={batchProductForm.name}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="batchProductPrice" className="text-right">
                      Price ($)
                    </Label>
                    <Input
                      id="batchProductPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={batchProductForm.currentPrice}
                      onChange={handleBatchProductPriceChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddRetiredBatchDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddBatchProduct}
                    disabled={!batchProductForm.batchId || batchProductForm.currentPrice <= 0}
                  >
                    Add to Products
                  </Button>
                </DialogFooter>
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
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={productForm.name}
                      onChange={handleProductChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select onValueChange={(value) => handleProductTypeChange(value as 'Egg' | 'Bird')}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Egg">Egg</SelectItem>
                        <SelectItem value="Bird">Bird</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {productForm.type === 'Egg' && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="condition" className="text-right">
                        Condition
                      </Label>
                      <Select onValueChange={(value) => handleProductConditionChange(value as 'Whole' | 'Broken' | 'NA')}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Whole">Whole</SelectItem>
                          <SelectItem value="Broken">Broken</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="currentPrice" className="text-right">
                      Price ($)
                    </Label>
                    <Input
                      id="currentPrice"
                      name="currentPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={productForm.currentPrice}
                      onChange={handleProductChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProduct}>Save Product</Button>
                </DialogFooter>
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
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={saleForm.date}
                      onChange={handleSaleFormChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customerId" className="text-right">
                      Customer
                    </Label>
                    <Select onValueChange={(value) => setSaleForm({...saleForm, customerId: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select customer (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="walkin">Walk-in Customer</SelectItem>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium mb-2">Add Products to Sale</h4>
                    <div className="flex items-end gap-2 mb-4">
                      <div className="flex-grow">
                        <Label htmlFor="productId" className="mb-1 block">
                          Product
                        </Label>
                        <Select onValueChange={handleSelectSaleProduct}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} (${product.currentPrice.toFixed(2)})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-24">
                        <Label htmlFor="quantity" className="mb-1 block">
                          Quantity
                        </Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={saleProduct.quantity}
                          onChange={handleQuantityChange}
                        />
                      </div>
                      <Button onClick={handleAddToSale}>
                        Add
                      </Button>
                    </div>
                    
                    {saleForm.products.length > 0 ? (
                      <div>
                        <h4 className="font-medium mb-2">Sale Items</h4>
                        <SaleItemsList
                          items={saleForm.products}
                          products={products}
                          onRemove={removeProductFromSale}
                        />
                        <div className="flex justify-end mt-2">
                          <Badge className="text-lg py-1 px-3">
                            Total: ${saleForm.totalAmount.toFixed(2)}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2 text-muted-foreground">
                        No products added to this sale yet.
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={saleForm.notes}
                      onChange={handleSaleFormChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsSaleDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitSale} disabled={saleForm.products.length === 0}>
                    Record Sale
                  </Button>
                </DialogFooter>
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
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newPrice" className="text-right">
                New Price ($)
              </Label>
              <Input
                id="newPrice"
                type="number"
                step="0.01"
                min="0"
                value={priceForm.newPrice}
                onChange={(e) => setPriceForm({...priceForm, newPrice: parseFloat(e.target.value) || 0})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPriceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePriceUpdate}>Update Price</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sales;
