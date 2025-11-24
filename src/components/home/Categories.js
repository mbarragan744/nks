export default function Categories({ categories }) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6">Categorías Populares</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <button
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 text-center group"
            onClick={() => {
              console.log(`Navegando a la categoría: ${category}`);
            }}
            type="button"
          >
            <div className="h-16 w-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <img
                src={`/placeholder.svg?height=40&width=40&text=${category[0]}`}
                alt={category}
                className="h-10 w-10"
              />
            </div>
            <span className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
