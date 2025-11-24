import React from "react";
import { Users, Target, Zap, Award } from "lucide-react";

export default function QuienesSomos() {
  return (
    <div className="flex-grow px-4 py-8 sm:px-6 lg:py-16">
      <section className="relative h-96">
        <img
          src="https://via.placeholder.com/500"
          alt="Equipo de trabajo colaborando"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#ff0000] bg-opacity-75 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
            Quiénes Somos
          </h1>
        </div>
      </section>

      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-[#ff0000] mb-8 text-center">
          Nuestra Historia
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-lg text-gray-800 mb-4">
              Nullam et felis vitae tellus semper finibus ut ut mi. Integer
              aliquet suscipit fermentum. Donec tempor id arcu semper
              ullamcorper. Maecenas egestas mi id tortor convallis feugiat.
              Aenean eu ultricies metus, non congue leo. Nullam dignissim risus
              sit amet hendrerit viverra. Nunc non arcu et ipsum finibus auctor
              et ut nunc. Nullam id elementum dolor. Ut molestie, nulla nec
              iaculis pharetra, quam metus rhoncus enim, sed auctor est neque eu
              sem. Vivamus non lectus eu mauris porttitor ultricies et viverra
              urna. Duis ut elementum ipsum. Vestibulum cursus libero at nisi
              fermentum, quis dictum nibh mollis. Aliquam bibendum finibus
              felis, nec vestibulum lorem pellentesque sed.{" "}
            </p>
            <p className="text-lg text-gray-800">
              Sed posuere, neque laoreet suscipit varius, ipsum ante tincidunt
              felis, sed rhoncus orci libero at metus. Donec enim eros,
              imperdiet ac pretium at, posuere eu massa.{" "}
            </p>
          </div>
          <div className="order-first md:order-last">
            <img
              src="https://via.placeholder.com/500"
              alt="Fundadores de la empresa"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#ff0000] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Nuestro Equipo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Person",
                role: "a",
                image: "https://via.placeholder.com/500",
              },
              {
                name: "Person",
                role: "a",
                image: "https://via.placeholder.com/500",
              },
              {
                name: "Person",
                role: "a",
                image: "https://via.placeholder.com/500",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-[#ff0000]">
                    {member.name}
                  </h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-[#ff0000] mb-8 text-center">
          Nuestros Valores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Users className="w-12 h-12 text-[#ff0000]" />,
              title: "Colaboración",
              description: "Trabajamos juntos para lograr objetivos comunes",
            },
            {
              icon: <Target className="w-12 h-12 text-[#ff0000]" />,
              title: "Excelencia",
              description: "Buscamos la perfección en todo lo que hacemos",
            },
            {
              icon: <Zap className="w-12 h-12 text-[#ff0000]" />,
              title: "Innovación",
              description: "Constantemente buscamos nuevas formas de mejorar",
            },
            {
              icon: <Award className="w-12 h-12 text-[#ff0000]" />,
              title: "Integridad",
              description: "Actuamos con honestidad y ética en todo momento",
            },
          ].map((value, index) => (
            <div key={index} className="text-center">
              <div className="mb-4 flex justify-center">{value.icon}</div>
              <h3 className="text-xl font-semibold text-[#ff0000] mb-2">
                {value.title}
              </h3>
              <p className="text-gray-800">{value.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
