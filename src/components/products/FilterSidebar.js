import React from 'react';
import FilterContent from './FilterContent';

export default function FilterSidebar({ 
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
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Filtros</h2>
      <FilterContent 
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
  );
}
