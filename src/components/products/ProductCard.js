import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from '../../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';  
import FilterSidebar from './FilterSidebar';

export default function ProductList({ initialShowDiscounts = false }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDiscounts, setShowDiscounts] = useState(initialShowDiscounts);
  const [showFilters, setShowFilters] = useState(false);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [engineSizes, setEngineSizes] = useState([]);
  const [selectedEngineSizes, setSelectedEngineSizes] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const { addToCart } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  // Cargar productos y configurar filtros iniciales
  useEffect(() => {
    const loadProductsFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
        
        const maxPrice = Math.max(...productsList.map(product => product.netPrice));
        setPriceRange([0, maxPrice]);

        const uniqueBrands = [...new Set(productsList.flatMap(product => 
          product.compatibleVehicles?.map(vehicle => vehicle.brand) || []
        ))];
        const uniqueModels = [...new Set(productsList.flatMap(product => 
          product.compatibleVehicles?.map(vehicle => vehicle.model) || []
        ))];
        const uniqueEngineSizes = [...new Set(productsList.flatMap(product => 
          product.compatibleVehicles?.map(vehicle => vehicle.engineSize) || []
        ))];
        const uniqueYears = [...new Set(productsList.flatMap(product => 
          product.compatibleVehicles?.map(vehicle => vehicle.year) || []
        ))];

        setBrands(uniqueBrands);
        setModels(uniqueModels);
        setEngineSizes(uniqueEngineSizes);
        setYears(uniqueYears);

        const queryParams = new URLSearchParams(location.search);
        setSelectedBrands(queryParams.getAll('brands') || []);
        setSelectedModels(queryParams.getAll('models') || []);
        setSelectedEngineSizes(queryParams.getAll('engineSizes') || []);
        setSelectedYears(queryParams.getAll('years') || []);

        // Precargar imágenes
        productsList.forEach(product => {
          const img = new Image();
          img.src = product.thumbnail;
        });

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener productos de Firestore:", error);
        setLoading(false);
      }
    };

    loadProductsFromFirestore();
  }, [location.search]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const discount = queryParams.get('discount');
    setShowDiscounts(discount === 'true');
  }, [location.search]);

  const formatPrice = (price) => {
    return `COP ${parseInt(price, 10).toLocaleString("es-CO")}`;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.netPrice >= priceRange[0] && product.netPrice <= priceRange[1];
    const matchesBrand = selectedBrands.length === 0 || product.compatibleVehicles?.some(vehicle => selectedBrands.includes(vehicle.brand));
    const matchesModel = selectedModels.length === 0 || product.compatibleVehicles?.some(vehicle => selectedModels.includes(vehicle.model));
    const matchesEngineSize = selectedEngineSizes.length === 0 || product.compatibleVehicles?.some(vehicle => selectedEngineSizes.includes(vehicle.engineSize));
    const matchesYear = selectedYears.length === 0 || product.compatibleVehicles?.some(vehicle => selectedYears.includes(vehicle.year));
    const matchesDiscount = !showDiscounts || (product.discount && parseFloat(product.discount) > 0);
    
    return matchesSearch && matchesPrice && matchesBrand && matchesModel && matchesEngineSize && matchesYear && matchesDiscount;
  });

  const ProductCard = ({ product, isLoading }) => {
    const discount = parseFloat(product.discount);
    const hasDiscount = discount > 0;
    const salePrice = product.netPrice;

    const handleAddToCart = (product) => {
      addToCart(product); 
      toast.success("Producto añadido correctamente al carrito!");
    };

    return (
      <div
        className="bg-white rounded-lg shadow-md flex flex-col justify-between h-full relative p-4"
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (!isLoading) {
            navigate(`/productdetail/${product.id}`);
          }
        }}
      >
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </div>
        )}
        <div className="text-center flex flex-col justify-between flex-1">
          <h2
            className="font-medium text-2xl sm:text-xl md:text-2xl mb-2 h-14 overflow-hidden text-ellipsis whitespace-nowrap"
            title={product.title}
          >
            {isLoading ? (
              <div className="bg-gray-300 h-6 w-3/4 mx-auto mb-2 rounded animate-pulse"></div>
            ) : (
              product.title
            )}
          </h2>
          <div className="w-3/4 mx-auto sm:w-full sm:mx-0 aspect-square relative bg-gray-200 rounded-lg overflow-hidden mb-4">
            {isLoading ? (
              <div className="w-full h-full bg-gray-300 animate-pulse"></div>
            ) : (
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            {isLoading ? (
              <>
                <div className="bg-gray-300 h-4 w-1/2 mx-auto mb-2 rounded animate-pulse"></div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="bg-gray-300 h-4 w-1/4 rounded animate-pulse"></div>
                  <div className="bg-gray-300 h-6 w-1/4 rounded animate-pulse"></div>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm mb-1">REFERENCIA {product.reference}</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  {hasDiscount ? (
                    <>
                      <span className="text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xl font-bold">{formatPrice(salePrice)}</span>
                    </>
                  ) : (
                    <span className="text-xl font-bold">{formatPrice(salePrice)}</span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-4">
          <button
            className="w-full mb-2 bg-red-50 text-red-600 text-sm border border-red-600 rounded py-1.5 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation();
              if (!isLoading) {
                setSelectedProduct(product);
                setOpenDialog(true);
              }
            }}
            disabled={isLoading}
          >
            VER TODAS LAS APLICACIONES
          </button>
          <button
            className="w-full bg-red-600 text-white rounded py-1.5 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation();
              if (!isLoading) {
                handleAddToCart(product); 
              }
            }}
            disabled={isLoading}
          >
            AÑADIR AL CARRITO
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">  
        <aside className={`w-full lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-24">
            <FilterSidebar 
              priceRange={priceRange} 
              setPriceRange={setPriceRange} 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              showDiscounts={showDiscounts} 
              setShowDiscounts={setShowDiscounts}
              brands={brands}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              models={models}
              selectedModels={selectedModels}
              setSelectedModels={setSelectedModels}
              engineSizes={engineSizes}
              selectedEngineSizes={selectedEngineSizes}
              setSelectedEngineSizes={setSelectedEngineSizes}
              years={years}
              selectedYears={selectedYears}
              setSelectedYears={setSelectedYears}
            />
          </div>
        </aside>
          <section className="w-full lg:w-3/4">
          <div className="mb-4 flex justify-between items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full bg-white text-gray-800 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors mb-4 sticky top-24 z-10"
            >
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </button>
          </div> 
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? Array(6)
                    .fill()
                    .map((_, index) => <ProductCard key={index} product={{}} isLoading={true} />)
                : filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} isLoading={false} />
                  ))}
            </div>
            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-gray-600">No se encontraron productos que coincidan con los filtros seleccionados.</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {openDialog && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Vehículos Compatibles - {selectedProduct.reference}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamaño Motor</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(selectedProduct.compatibleVehicles) &&
                    selectedProduct.compatibleVehicles.map((vehicle, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.brand}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.model}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.engineSize}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <button
              className="mt-4 px-6 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700"
              onClick={() => setOpenDialog(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" style={{ top: "120px" }} />
    </div>
  );
}
