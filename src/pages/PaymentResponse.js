import React, { useState, useEffect } from 'react';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';

const PaymentResponse = () => {
  const { user: currentUser } = useAuth();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref_payco = urlParams.get('ref_payco');

    const removeProductsFromCart = async () => {
      if (currentUser) {
        const cartRef = doc(db, 'carts', currentUser.uid);
        await setDoc(cartRef, { items: [] }, { merge: true });
      }
    };

    const savePurchaseInOrders = async (paymentData) => {
      if (currentUser) {
        const ordersRef = collection(db, 'orders');
        const orderData = {
          userId: currentUser.uid,
          transactionId: paymentData.x_id_invoice,
          transactionDate: new Date(paymentData.x_transaction_date),
          products: Array.isArray(paymentData.cartWithDetails) 
            ? paymentData.cartWithDetails.map(item => ({
                title: item.title,
                quantity: item.quantity,
                price: item.netPrice,
              })) 
            : [],
          totalAmount: paymentData.x_amount,
          paymentStatus: paymentData.x_transaction_state,
          transactionUrl: window.location.href,
        };
    
        try {
          await addDoc(ordersRef, orderData);
        } catch (error) {
          console.error("Error al guardar la orden:", error);
        }
      }
    };    

    if (ref_payco) {
      fetch(`https://secure.epayco.co/validation/v1/reference/${ref_payco}`)
        .then(response => response.json())
        .then(data => {
          setPaymentInfo(data.data);
          setLoading(false);

          if (data.data.x_transaction_state === 'Aceptada') {
            removeProductsFromCart();
            savePurchaseInOrders(data.data);
          }
        })
        .catch(error => {
          console.error('Error fetching payment info:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!paymentInfo) {
    return (
      <div className="flex-grow px-4 py-36 sm:px-6 lg:py-40">
        <h1 className="text-2xl font-bold mb-4">Error en la transacción</h1>
        <p>No se pudo obtener la información del pago. Por favor, contacte con soporte.</p>
      </div>
    );
  }

  return (
    <div className="flex-grow px-4 py-36 sm:px-6 lg:py-40">
      <h1 className="text-3xl font-bold mb-6 text-center">Resumen de la Compra</h1>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Estado de la transacción</h2>
          <p className={`text-lg ${paymentInfo.x_transaction_state === 'Aceptada' ? 'text-green-600' : 'text-red-600'}`}>
            {paymentInfo.x_transaction_state}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Detalles del pedido</h3>
            <p><span className="font-medium">Referencia:</span> {paymentInfo.x_id_invoice}</p>
            <p><span className="font-medium">Descripción:</span> {paymentInfo.x_description}</p>
            <p><span className="font-medium">Fecha:</span> {new Date(paymentInfo.x_transaction_date).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Detalles del pago</h3>
            <p><span className="font-medium">Monto:</span> {formatPrice(paymentInfo.x_amount)}</p>
            <p><span className="font-medium">Moneda:</span> {paymentInfo.x_currency_code}</p>
            <p><span className="font-medium">Método de pago:</span> {paymentInfo.x_type_payment}</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <a href="/" className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
            Volver a la tienda
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentResponse;
