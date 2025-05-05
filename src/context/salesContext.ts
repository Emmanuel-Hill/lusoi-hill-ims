
import { useState } from 'react';

export const useSalesState = (
  initialSales: any[] = [],
  initialProducts: any[] = []
) => {
  const [sales, setSales] = useState(initialSales);
  const [products, setProducts] = useState(initialProducts);

  const addProduct = (product: any) => {
    setProducts([...products, product]);
  };

  const updateProductPrice = (productId: string, price: number) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, currentPrice: price, priceUpdatedAt: new Date().toISOString() } 
        : product
    ));
  };

  const addSale = (sale: any) => {
    setSales([...sales, sale]);
  };

  return {
    sales,
    products,
    addProduct,
    updateProductPrice,
    addSale
  };
};
