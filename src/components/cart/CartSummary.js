import React from 'react';

const CartSummary = ({ totalItems, totalPrice, checkout, isLoading, isEpaycoLoaded }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(price);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen del Carrito</h2>
      <div className="flex justify-between text-gray-900 mb-2">
        <p>Total de artículos:</p>
        <p>{totalItems}</p>
      </div>
      <div className="flex justify-between text-gray-900 mb-4">
        <p>Total:</p>
        <p>{formatPrice(totalPrice)}</p>
      </div>
      <button
        onClick={checkout}
        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
        disabled={totalItems === 0 || !isEpaycoLoaded || isLoading}
      >
        {isEpaycoLoaded ? 'Proceder al Pago' : 'Cargando ePayco...'}
      </button>
    </div>
  );
};

export default CartSummary;

