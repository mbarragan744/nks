import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Carlos Rodríguez",
    role: "Motociclista Entusiasta",
    image: "https://via.placeholder.com/100x100.png?text=CR",
    content: "MotoPartes ha sido mi tienda de confianza durante años. Siempre encuentro lo que necesito y el servicio al cliente es excepcional.",
    rating: 5
  },
  {
    id: 2,
    name: "Ana Martínez",
    role: "Mecánica Profesional",
    image: "https://via.placeholder.com/100x100.png?text=AM",
    content: "Como mecánica, valoro la calidad de los repuestos. MotoPartes siempre ofrece productos de primera calidad a precios competitivos.",
    rating: 5
  },
  {
    id: 3,
    name: "Luis Hernández",
    role: "Piloto de Motocross",
    image: "https://via.placeholder.com/100x100.png?text=LH",
    content: "La variedad de piezas para motos de competición es impresionante. MotoPartes es mi go-to para mantener mi moto en óptimas condiciones.",
    rating: 4
  }
];

const TestimonialCard = ({ name, role, image, content, rating }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center mb-4">
      <img src={image} alt={name} className="w-12 h-12 rounded-full mr-4" />
      <div>
        <h3 className="font-semibold text-lg">{name}</h3> 
        <p className="text-gray-600 text-sm">{role}</p>
      </div>
    </div>
    <p className="text-gray-700 mb-4">{content}</p>
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
    </div>
  </div>
);


export default function TestimonialSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-8">Lo que dicen nuestros clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
