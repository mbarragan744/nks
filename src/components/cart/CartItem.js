import React from 'react';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(price);
  };

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 space-y-4 sm:space-y-0">
      <div className="flex items-start space-x-4 w-full sm:w-auto">
        <img src={item.thumbnail} alt={item.title} className="h-20 w-20 object-cover rounded-md" />
        <div className="flex-grow">
          <p className="text-lg font-semibold text-gray-900">{item.title}</p>
          <p className="text-sm text-gray-500">Precio: {formatPrice(item.netPrice)}</p>
          <p className="text-sm text-gray-500">Stock disponible: {item.stock}</p>
        </div>
      </div>
      <div className="flex flex-col sm:items-end space-y-2 w-full sm:w-auto">
        <div className="flex items-center justify-between sm:justify-end w-full">
          <span className="text-sm text-gray-500 sm:hidden">Cantidad:</span>
          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded-l"
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span className="bg-gray-100 px-4 py-1">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded-r"
              disabled={item.quantity >= item.stock}
            >
              +
            </button>
          </div>
        </div>
        <p className="text-lg font-semibold text-gray-900 sm:text-right">
          {formatPrice(item.netPrice * item.quantity)}
        </p>
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-600 hover:text-red-800 text-sm sm:self-end"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default CartItem;