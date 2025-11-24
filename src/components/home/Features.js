import { Lock, CreditCard, Package } from 'lucide-react'

export default function Features() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-black text-5xl sm:text-6xl font-bold text-center mb-16">
        CON NKS COMPRA
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
        {[
          {
            icon: Lock,
            title: "DE FORMA SEGURA",
          },
          {
            icon: CreditCard,
            title: "PAGA EN LÍNEA",
          },
          {
            icon: Package,
            title: "RECIBE EN CASA O NEGOCIO",
          },
        ].map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full bg-black flex items-center justify-center relative z-10">
                <feature.icon className="w-16 h-16 text-white" />
              </div>
              <div 
                className="absolute inset-0 bg-black rounded-full transform rotate-12"
                style={{
                  clipPath: 'circle(50% at 50% 50%)',
                  filter: 'blur(4px)',
                }}
              />
            </div>
            <h3 className="text-xl font-bold text-black mt-4 uppercase">
              {feature.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  )
}

