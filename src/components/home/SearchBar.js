import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const FilterSearch = () => {
  const [filters, setFilters] = useState({
    brands: [],
    models: [],
    engineSizes: [],
    years: [],
    references: [],
  });

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedEngineSize, setSelectedEngineSize] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [filteredOptions, setFilteredOptions] = useState({
    models: [],
    engineSizes: [],
    years: [],
    references: [],
  });

  const [productData, setProductData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setProductData(data);

      const brands = new Set();
      data.forEach((product) => {
        product.compatibleVehicles.forEach((vehicle) => {
          brands.add(vehicle.brand);
        });
      });

      setFilters((prev) => ({
        ...prev,
        brands: [...brands],
      }));
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!productData.length) return;

    const models = new Set();
    const engineSizes = new Set();
    const years = new Set();
    const references = new Set();

    productData.forEach((product) => {
      product.compatibleVehicles.forEach((vehicle) => {
        if (!selectedBrand || vehicle.brand === selectedBrand) {
          models.add(vehicle.model);
        }
        if (
          (!selectedBrand || vehicle.brand === selectedBrand) &&
          (!selectedModel || vehicle.model === selectedModel)
        ) {
          engineSizes.add(vehicle.engineSize);
        }
        if (
          (!selectedBrand || vehicle.brand === selectedBrand) &&
          (!selectedModel || vehicle.model === selectedModel) &&
          (!selectedEngineSize || vehicle.engineSize === selectedEngineSize)
        ) {
          years.add(vehicle.year);
        }
      });

      if (
        (!selectedBrand ||
          product.compatibleVehicles.some((v) => v.brand === selectedBrand)) &&
        (!selectedModel ||
          product.compatibleVehicles.some((v) => v.model === selectedModel))
      ) {
        references.add(product.reference);
      }
    });

    setFilteredOptions({
      models: [...models],
      engineSizes: [...engineSizes],
      years: [...years],
      references: [...references],
    });
  }, [selectedBrand, selectedModel, selectedEngineSize, productData]);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (selectedBrand) queryParams.append("brands", selectedBrand);
    if (selectedModel) queryParams.append("models", selectedModel);
    if (selectedEngineSize)
      queryParams.append("engineSizes", selectedEngineSize);
    if (selectedYear) queryParams.append("years", selectedYear);
    navigate(`/products?${queryParams.toString()}`);
  };

  const filterLabels = {
    brands: "Marca",
    models: "Modelo",
    engineSizes: "Cilindrada",
    years: "Año",
    references: "Referencia",
  };

  return (
    <div className="mx-auto mb-4 lg:mt-6">
      <div className="bg-gradient-to-r from-[#ff0000] to-[#d70000] rounded-lg shadow-md overflow-hidden">
        <div className="p-3">
          <div
            className={`flex items-center text-white text-lg sm:text-3xl font-bold ${
              isMobile
                ? "cursor-pointer justify-between w-full"
                : "justify-center w-full"
            }`}
            onClick={() => isMobile && setShowFilters(!showFilters)}
          >
            <span className={`text-center ${isMobile ? "w-auto" : "w-full"}`}>
              Encuentra el filtro ideal para tu moto
            </span>
            {isMobile && (
              <ChevronDown
                className={`transform transition-transform duration-300 ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            )}
          </div>

          {(showFilters || !isMobile) && (
            <div
              className={`mt-4 ${
                isMobile ? "space-y-4" : "flex flex-wrap gap-2"
              }`}
            >
              {Object.keys(filters).map((filterKey, index) => {
                const isDisabled =
                  filterKey === "models" && !selectedBrand
                    ? !isMobile
                    : filterKey === "engineSizes" &&
                      (!selectedBrand || !selectedModel)
                    ? !isMobile
                    : filterKey === "years" &&
                      (!selectedBrand || !selectedModel || !selectedEngineSize)
                    ? !isMobile
                    : false;

                const isVisible = isMobile
                  ? filterKey === "brands" ||
                    (filterKey === "models" && selectedBrand) ||
                    (filterKey === "engineSizes" && selectedModel) ||
                    (filterKey === "years" && selectedEngineSize)
                  : true;

                return (
                  isVisible && (
                    <div
                      key={filterKey}
                      className={`relative bg-white rounded-md ${
                        isMobile ? "w-full" : "flex-1"
                      }`}
                    >
                      <select
                        className={`w-full appearance-none text-gray-700 py-2 px-3 pr-8 rounded-md text-sm ${
                          isDisabled
                            ? "text-gray-400 cursor-not-allowed"
                            : "focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 ease-in-out"
                        }`}
                        value={
                          filterKey === "brands"
                            ? selectedBrand
                            : filterKey === "models"
                            ? selectedModel
                            : filterKey === "engineSizes"
                            ? selectedEngineSize
                            : filterKey === "years"
                            ? selectedYear
                            : ""
                        }
                        disabled={isDisabled}
                        onChange={(e) => {
                          if (filterKey === "brands")
                            setSelectedBrand(e.target.value);
                          if (filterKey === "models")
                            setSelectedModel(e.target.value);
                          if (filterKey === "engineSizes")
                            setSelectedEngineSize(e.target.value);
                          if (filterKey === "years")
                            setSelectedYear(e.target.value);
                        }}
                      >
                        <option value="">{`Selecciona ${filterLabels[filterKey]}`}</option>
                        {(filterKey === "brands"
                          ? filters[filterKey]
                          : filteredOptions[filterKey]
                        ).map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          )}
        </div>
      </div>
      {(!isMobile || showFilters) && (
        <button
          onClick={handleSearch}
          className="mt-4 w-full bg-black text-white py-3 px-3 rounded-md hover:bg-[#121212] transition-colors duration-300 ease-in-out text-sm font-semibold"
        >
          Buscar filtro
        </button>
      )}
    </div>
  );
};

export default FilterSearch;
