// next.config.mjs
const nextConfig = {
  // Activa el modo estricto en React
  reactStrictMode: true,
  
  // Habilita el soporte para imágenes optimizadas en Next.js
  images: {
    domains: ['example.com'], // Aquí puedes añadir los dominios de los que se permiten cargar imágenes
  },

  // Configuración para el manejo de i18n (internacionalización)
  i18n: {
    locales: ['en', 'es'], // Idiomas soportados
    defaultLocale: 'en', // Idioma por defecto
  },

  // Evita la recopilación de datos anónimos en Next.js
  telemetry: false,

  // Activa la minificación de archivos JavaScript con SWC
  swcMinify: true,

  // Configuración para webpack
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false, // Evita errores de "fs" en el lado del cliente
      };
    }
    return config;
  },

  // Otros ajustes adicionales
  output: 'standalone', // Permite ejecutar el proyecto de forma independiente (opcional)
};

export default nextConfig;
