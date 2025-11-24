import React from 'react';
import { useLocation } from 'react-router-dom';
import ProductList from '../components/products/ProductCard';

export default function ProductPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialShowDiscounts = queryParams.get('discount') === 'true';

  return (
    <div className="flex-grow px-4 py-4 sm:px-6 lg:py-10">
      <div className="container mx-auto px-4 py-2 max-w-7xl">
        <h1 className="text-3xl mx-auto px-4 py-2 max-w-7xl font-bold text-[#201c1c]">Productos NKS</h1>
        <ProductList initialShowDiscounts={initialShowDiscounts} />
      </div>
    </div>
  );
}
