import React from 'react';
import { Search, Percent, ChevronDown } from 'lucide-react';

export default function FilterContent({ 
  searchTerm, 
  setSearchTerm, 
  showDiscounts, 
  setShowDiscounts, 
  brands, 
  selectedBrands, 
  setSelectedBrands,
  models,
  selectedModels,
  setSelectedModels,
  engineSizes,
  selectedEngineSizes,
  setSelectedEngineSizes,
  years,
  selectedYears,
  setSelectedYears
}) {
  const [expandedSections, setExpandedSections] = React.useState({
    brands: false,
    models: false,
    engineSizes: false,
    years: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sectionData = {
    brands,
    models,
    engineSizes,
    years
  };

  const selectedData = {
    brands: selectedBrands,
    models: selectedModels,
    engineSizes: selectedEngineSizes,
    years: selectedYears
  };

  const setSelectedData = {
    brands: setSelectedBrands,
    models: setSelectedModels,
    engineSizes: setSelectedEngineSizes,
    years: setSelectedYears
  };

  const sectionLabels = {
    brands: "Marcas",
    models: "Modelos",
    engineSizes: "Cilindraje",
    years: "Años"
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar productos..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <button
        onClick={() => setShowDiscounts(!showDiscounts)}
        className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${showDiscounts ? 'bg-red-600 text-white' : 'bg-white text-red-600 border border-red-600'}`}
      >
        <Percent className="inline-block w-4 h-4 mr-2" />
        {showDiscounts ? "Mostrar todos los productos" : "Ver solo ofertas"}
      </button>

      {Object.entries(sectionData).map(([id, data]) => (
        <div key={id} className="border-b border-gray-200 pb-2">
          <button
            onClick={() => toggleSection(id)}
            className="flex justify-between items-center w-full py-2 text-left text-sm font-medium text-gray-700"
          >
            <span>{sectionLabels[id]}</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections[id] ? 'transform rotate-180' : ''}`} />
          </button>
          {expandedSections[id] && (
            <div className="mt-2 space-y-2">
              {data.map((item) => (
                <label key={item} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={Array.isArray(selectedData[id]) && selectedData[id].includes(item)}
                    onChange={() => {
                      const setFunction = setSelectedData[id];
                      setFunction(prev => {
                        const array = Array.isArray(prev) ? prev : [];
                        return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
                      });
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

