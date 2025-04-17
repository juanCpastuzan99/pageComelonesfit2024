"use client";

import { useState, useEffect } from 'react';

// Componente SVG para los iconos (no modificables por el admin)
const IconSVG = ({ type }) => {
  switch (type) {
    case 'natural':
      return (
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="23" fill="#E8F5E9" stroke="#4CAF50" strokeWidth="2"/>
          <path d="M15 25L22 32L35 19" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'frutos':
      return (
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="23" fill="#FCE4EC" stroke="#E91E63" strokeWidth="2"/>
          <path d="M25 15C28 15 35 19 35 27C35 33 30 35 25 35C20 35 15 33 15 27C15 19 22 15 25 15Z" fill="#E91E63"/>
          <circle cx="22" cy="23" r="2" fill="white"/>
          <circle cx="28" cy="23" r="2" fill="white"/>
        </svg>
      );
    case 'miel':
      return (
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="23" fill="#FFF8E1" stroke="#FFA000" strokeWidth="2"/>
          <path d="M32 20L25 15L18 20V30L25 35L32 30V20Z" fill="#FFA000"/>
          <path d="M25 35V25M25 25V15M25 25L18 20M25 25L32 20" stroke="#FFC107" strokeWidth="1.5"/>
        </svg>
      );
    case 'pack':
      return (
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="23" fill="#E3F2FD" stroke="#2196F3" strokeWidth="2"/>
          <rect x="15" y="18" width="20" height="14" rx="2" fill="#2196F3"/>
          <path d="M22 25L25 28L28 25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M25 28V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return null;
  }
};

// Componente de característica con SVG (no modificable por el admin)
const FeatureSVG = ({ type }) => {
  switch (type) {
    case 'natural':
      return (
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="35" cy="35" r="35" fill="#E8F5E9"/>
          <path d="M20 38C20 25 35 25 45 35C40 45 30 50 20 38Z" fill="#4CAF50"/>
          <path d="M38 20C47 28 45 40 35 45C25 40 25 25 38 20Z" fill="#4CAF50"/>
        </svg>
      );
    case 'proteina':
      return (
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="35" cy="35" r="35" fill="#E8F5E9"/>
          <path d="M25 20L35 25V50L25 45V20Z" fill="#4CAF50"/>
          <path d="M35 25L45 20V45L35 50V25Z" fill="#2E7D32"/>
          <path d="M30 32V40" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M40 32V40" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case 'artesanal':
      return (
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="35" cy="35" r="35" fill="#E8F5E9"/>
          <path d="M25 20C22 20 20 22 20 25C20 28 22 30 25 30H45C48 30 50 32 50 35C50 38 48 40 45 40H25C22 40 20 42 20 45C20 48 22 50 25 50H45" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      );
    default:
      return null;
  }
};

// Componente de tarjeta de producto
const ProductCard = ({ 
  title, 
  description, 
  iconType, 
  price, 
  benefits,
  imageUrl
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="card h-100 border-0 shadow-sm rounded-lg overflow-hidden"
      style={{ 
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 0.3s ease-in-out',
        maxWidth: '350px',
        margin: '0 auto'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Canvas para la imagen del producto (placeholder si no hay imagen) */}
      <div className="position-relative bg-light" style={{height: '200px'}}>
        {imageUrl ? (
          <img src={imageUrl} className="w-100 h-100" alt={title} style={{objectFit: 'cover'}} />
        ) : (
          <canvas 
            width="350" 
            height="200" 
            id={`canvas-${title.toLowerCase().replace(/\s+/g, '-')}`}
            className="w-100 h-100"
            style={{backgroundColor: '#f8f9fa'}}
          />
        )}
        <div className="position-absolute top-0 end-0 m-3">
          <IconSVG type={iconType} />
        </div>
      </div>
      
      <div className="card-body p-4">
        <h3 className="card-title h5 fw-bold mb-3">{title}</h3>
        <p className="card-text text-muted mb-3">{description}</p>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="price-tag fw-bold text-success mb-0">{price}</h4>
          <span className="badge bg-success bg-opacity-10 text-success px-2 py-1">Artesanal</span>
        </div>
        
        <h5 className="benefits-title h6 text-uppercase text-muted small mb-2">Beneficios</h5>
        <ul className="list-unstyled mb-4">
          {benefits.map((benefit, index) => (
            <li key={index} className="d-flex align-items-center mb-2">
              <span className="text-success me-2">✓</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="card-footer bg-white border-0 p-4">
        <button 
          className={`btn btn-${isHovered ? 'success' : 'outline-success'} w-100`}
          style={{ transition: 'all 0.3s ease' }}
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};

// Componente principal de servicios y página
export default function ServicesPage() {
  useEffect(() => {
    initCanvas();
  }, []);

  const products = [
    {
      title: "Yogur Griego Natural",
      description: "Cremoso y rico en proteínas. Perfecto como base para tus recetas fitness.",
      iconType: "natural",
      price: "$75",
      benefits: ["20g de proteína", "Sin azúcares añadidos", "Cremoso y fresco"],
      imageUrl: "" // El admin puede cambiar esto
    },
    {
      title: "Yogur Griego con Frutos Rojos",
      description: "Deliciosa combinación de yogur griego con frutos del bosque.",
      iconType: "frutos",
      price: "$85",
      benefits: ["Antioxidantes naturales", "Bajo en calorías", "Alto valor nutricional"],
      imageUrl: "" // El admin puede cambiar esto
    },
    {
      title: "Yogur Griego con Miel",
      description: "La dulzura natural de la miel combinada con nuestro yogur artesanal.",
      iconType: "miel",
      price: "$80",
      benefits: ["Energizante natural", "Prebióticos", "Ideal para desayunos"],
      imageUrl: "" // El admin puede cambiar esto
    },
    {
      title: "Pack Fitness Semanal",
      description: "Selección variada de yogures para toda tu semana de entrenamiento.",
      iconType: "pack",
      price: "$299",
      benefits: ["7 yogures variados", "Guía nutricional", "Descuento por pack"],
      imageUrl: "" // El admin puede cambiar esto
    }
  ];

  return (
    <div className="py-5">
      <div className="container">
        {/* Encabezado de la sección */}
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">Yogur Griego Artesanal</h2>
          <div className="mx-auto" style={{ maxWidth: '700px' }}>
            <p className="lead text-muted">
              Elaborado con los mejores ingredientes y métodos tradicionales para ofrecerte 
              el mejor sabor y los máximos beneficios para tu salud y bienestar.
            </p>
          </div>
        </div>

        {/* Grid de productos */}
        <div className="row g-4 mb-5">
          {products.map((product, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-3">
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* Características adicionales - usando SVG fijos */}
        <div className="row mt-5 pt-5 border-top">
          <div className="col-12 text-center mb-4">
            <h3 className="h4 fw-bold">¿Por qué elegir nuestro yogur?</h3>
          </div>
          
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="text-center">
              <div className="mx-auto mb-3">
                <FeatureSVG type="natural" />
              </div>
              <h4 className="h5 fw-bold">Ingredientes Naturales</h4>
              <p className="text-muted px-3">Elaborado con leche de alta calidad y cultivos probióticos seleccionados.</p>
            </div>
          </div>
          
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="text-center">
              <div className="mx-auto mb-3">
                <FeatureSVG type="proteina" />
              </div>
              <h4 className="h5 fw-bold">Alto en Proteínas</h4>
              <p className="text-muted px-3">Ideal para deportistas y personas con estilo de vida activo.</p>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="text-center">
              <div className="mx-auto mb-3">
                <FeatureSVG type="artesanal" />
              </div>
              <h4 className="h5 fw-bold">Proceso Artesanal</h4>
              <p className="text-muted px-3">Elaboración tradicional que maximiza sabor y beneficios nutricionales.</p>
            </div>
          </div>
        </div>
        
        {/* Banner promocional usando Canvas */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 bg-success text-white rounded-lg overflow-hidden">
              <div className="row g-0">
                <div className="col-md-7 p-5 d-flex flex-column justify-content-center">
                  <h2 className="h3 fw-bold mb-3">Primera compra con 15% de descuento</h2>
                  <p className="mb-4">Usa el código <strong>FITHEALTH15</strong> en tu primera compra y recibe un 15% de descuento.</p>
                  <div>
                    <button className="btn btn-light text-success fw-bold px-4 py-2">Comprar ahora</button>
                  </div>
                </div>
                <div className="col-md-5 d-none d-md-block position-relative">
                  <canvas 
                    id="promo-canvas" 
                    width="400" 
                    height="300"
                    className="w-100 h-100"
                    style={{backgroundColor: '#388E3C'}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Función para inicializar los canvas después de que se carga el componente
const initCanvas = () => {
  if (typeof window !== 'undefined') {
    // Inicializar los canvas de productos
    document.querySelectorAll('canvas[id^="canvas-"]').forEach(canvas => {
      const ctx = canvas.getContext('2d');
      // Dibujar un placeholder simple
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Texto de placeholder
      ctx.fillStyle = '#aaaaaa';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Imagen del Producto', canvas.width/2, canvas.height/2);
    });
    
    // Inicializar el canvas promocional
    const promoCanvas = document.getElementById('promo-canvas');
    if (promoCanvas) {
      const ctx = promoCanvas.getContext('2d');
      
      // Fondo
      ctx.fillStyle = '#388E3C';
      ctx.fillRect(0, 0, promoCanvas.width, promoCanvas.height);
      
      // Dibujar yogur simple
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(200, 150, 80, 0, Math.PI*2);
      ctx.fill();
      
      ctx.fillStyle = '#e0e0e0';
      ctx.beginPath();
      ctx.arc(200, 150, 70, 0, Math.PI*2);
      ctx.fill();
      
      // Texto promocional
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('15% OFF', 200, 70);
    }
  }
};