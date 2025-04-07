
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Plus,
  Trash2,
  Edit,
  ShoppingCart,
  Tag,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const Sales = () => {
  const {
    products,
    addProduct,
    updateProductPrice,
    sales,
    addSale,
    customers,
  } = useAppContext();

  // Product Dialog State
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isEditPriceDialogOpen, setIsEditPriceDialogOpen] = useState(false);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    type: 'Egg' as 'Egg' | 'Bird',
    condition: 'Whole' as 'Whole' | 'Broken' | 'NA',
    currentPrice: 0,
  });
  
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

    addProduct(productForm);
    setProductForm({
      name: '',
      type: 'Egg',
      condition: 'Whole',
      currentPrice: 0,
    });
    setIsProductDialogOpen(false);
    toast.success('Product added successfully');
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

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const getCustomerName = (customerId?: string) => {
    if (!customerId) return 'Walk-in Customer';
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
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
      
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>
        
        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-end">
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {product.condition === 'NA' ? '-' : product.condition}
                        </TableCell>
                        <TableCell>${product.currentPrice.toFixed(2)}</TableCell>
                        <TableCell>{product.priceUpdatedAt}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPriceClick(product)}
                          >
                            <Tag className="h-4 w-4 mr-1" />
                            Update Price
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No products added yet. Start by adding a product.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
                        <SelectItem value="">Walk-in Customer</SelectItem>
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
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {saleForm.products.map((item) => (
                              <TableRow key={item.productId}>
                                <TableCell>{getProductName(item.productId)}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>${item.pricePerUnit.toFixed(2)}</TableCell>
                                <TableCell>${(item.quantity * item.pricePerUnit).toFixed(2)}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeProductFromSale(item.productId)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.length > 0 ? (
                    sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{sale.date}</TableCell>
                        <TableCell>{getCustomerName(sale.customerId)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 max-h-20 overflow-y-auto">
                            {sale.products.map((item) => (
                              <div key={item.productId} className="text-xs">
                                {getProductName(item.productId)} x {item.quantity}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>${sale.totalAmount.toFixed(2)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{sale.notes || '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No sales recorded yet. Start by recording a sale.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
