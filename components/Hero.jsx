import React from 'react';
import Link from 'next/link';

const Hero = ({ onShowLogin }) => {
  return (
    <div className="text-center py-20 sm:py-32 bg-white dark:bg-gray-800">
      <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
        Bienvenido a <span className="text-green-500">Comelones Fit</span>
      </h1>
      <p className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Tu plataforma para gestionar y vender productos saludables. Administra tu inventario, sigue tus ventas y atiende a tus clientes, todo en un solo lugar.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={onShowLogin}
          className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors"
        >
          Comenzar ahora
        </button>
        <Link href="/#features" className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
          Saber más
        </Link>
      </div>
    </div>
  );
};

export default Hero; 