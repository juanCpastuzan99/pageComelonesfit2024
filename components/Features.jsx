import React from 'react';

const features = [
  {
    icon: '📦',
    title: 'Gestión de Inventario',
    description: 'Añade, edita y elimina productos fácilmente. Mantén tu stock siempre actualizado.',
  },
  {
    icon: '👤',
    title: 'Roles de Usuario',
    description: 'Asigna roles de administrador o visitante para controlar el acceso a las funciones clave.',
  },
  {
    icon: '🛒',
    title: 'Carrito de Compras',
    description: 'Tus clientes pueden añadir productos a un carrito persistente, mejorando la experiencia de compra.',
  },
  {
    icon: '🔒',
    title: 'Autenticación Segura',
    description: 'Sistema de inicio de sesión y registro robusto para proteger los datos de tus usuarios.',
  },
];

const Features = () => {
  return (
    <div id="features" className="py-20 sm:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Descubre las herramientas que te ayudarán a crecer tu negocio.
          </p>
        </div>
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white text-2xl mx-auto">
                {feature.icon}
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features; 