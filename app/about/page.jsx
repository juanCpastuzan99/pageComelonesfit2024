"use client";

import { useEffect } from 'react';

// SVG para misión
const MissionSVG = () => {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#E8F5E9"/>
      <path d="M30 50C30 38.954 38.954 30 50 30C61.046 30 70 38.954 70 50C70 61.046 61.046 70 50 70C38.954 70 30 61.046 30 50Z" fill="#4CAF50"/>
      <path d="M47 40L53 50L47 60" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

// SVG para visión
const VisionSVG = () => {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#E8F5E9"/>
      <circle cx="50" cy="50" r="20" fill="#4CAF50"/>
      <circle cx="50" cy="50" r="10" fill="white"/>
      <path d="M30 50H20" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
      <path d="M80 50H70" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 30V20" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 80V70" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
};

// SVG para valores
const ValuesSVG = () => {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#E8F5E9"/>
      <path d="M35 40H65V70H35V40Z" fill="#4CAF50"/>
      <path d="M42 30L42 40" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
      <path d="M58 30L58 40" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
      <path d="M43 50L48 55L58 45" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M43 60H58" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
};

const AboutPage = () => {
  // Inicializar el canvas decorativo cuando se carga el componente
  useEffect(() => {
    const initCanvas = () => {
      const canvas = document.getElementById('about-decoration');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Limpiar el canvas
        ctx.clearRect(0, 0, width, height);
        
        // Dibujar formas decorativas
        for (let i = 0; i < 15; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = Math.random() * 20 + 5;
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(76, 175, 80, ${Math.random() * 0.15 + 0.05})`;
          ctx.fill();
        }
        
        // Dibujar líneas decorativas
        for (let i = 0; i < 8; i++) {
          const startX = Math.random() * width;
          const startY = Math.random() * height;
          const endX = startX + (Math.random() - 0.5) * 250;
          const endY = startY + (Math.random() - 0.5) * 250;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = `rgba(76, 175, 80, ${Math.random() * 0.1 + 0.05})`;
          ctx.lineWidth = Math.random() * 2 + 1;
          ctx.stroke();
        }
      }
    };
    
    initCanvas();
  }, []);

  return (
    <div className="min-vh-100 position-relative py-5">
      <canvas 
        id="about-decoration" 
        width="1000" 
        height="1000" 
        className="position-absolute top-0 start-0 w-100 h-100" 
        style={{pointerEvents: 'none', zIndex: -1}}
      />
      
      <div className="container py-5">
        {/* Encabezado */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-success mb-3">Sobre Nosotros</h1>
          <p className="lead text-muted mx-auto" style={{maxWidth: '700px'}}>
            En ComelonesFit creemos que la nutrición saludable es el mejor camino hacia el bienestar. 
            Nuestros productos artesanales son parte de un compromiso con tu salud y calidad de vida.
          </p>
        </div>
        
        {/* Sección de Misión */}
        <div className="row align-items-center mb-5 py-4">
          <div className="col-md-6 text-center mb-4 mb-md-0">
            <div className="d-inline-block">
              <MissionSVG />
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-lg">
              <div className="card-body p-4 p-lg-5">
                <h2 className="h3 text-success fw-bold mb-4">MISIÓN</h2>
                <p className="mb-0">
                  Nuestra misión es proporcionar productos lácteos artesanales de la más alta calidad, 
                  elaborados con ingredientes naturales y procesos tradicionales que preservan todos 
                  sus beneficios nutricionales. Buscamos promover hábitos alimenticios saludables y 
                  contribuir al bienestar físico de nuestros clientes a través de alimentos deliciosos 
                  y nutritivos que complementen un estilo de vida activo.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sección de Visión */}
        <div className="row align-items-center flex-md-row-reverse mb-5 py-4">
          <div className="col-md-6 text-center mb-4 mb-md-0">
            <div className="d-inline-block">
              <VisionSVG />
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-lg">
              <div className="card-body p-4 p-lg-5">
                <h2 className="h3 text-success fw-bold mb-4">VISIÓN</h2>
                <p className="mb-0">
                  Aspiramos a convertirnos en el referente nacional en alimentación saludable, 
                  reconocidos por la excelencia de nuestros yogures griegos artesanales y por nuestro 
                  compromiso con la educación nutricional. Queremos ser parte integral de la transformación 
                  hacia una sociedad más consciente de su alimentación, donde el consumo de productos 
                  naturales y nutritivos sea la base de un estilo de vida equilibrado y saludable.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sección de Valores */}
        <div className="row align-items-center mb-5 py-4">
          <div className="col-md-6 text-center mb-4 mb-md-0">
            <div className="d-inline-block">
              <ValuesSVG />
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-lg">
              <div className="card-body p-4 p-lg-5">
                <h2 className="h3 text-success fw-bold mb-4">VALORES</h2>
                <ul className="list-unstyled mb-0">
                  <li className="d-flex align-items-center mb-3">
                    <span className="text-success me-2">✓</span>
                    <strong>Calidad:</strong> Utilizamos ingredientes seleccionados y procesos artesanales que garantizan productos excepcionales.
                  </li>
                  <li className="d-flex align-items-center mb-3">
                    <span className="text-success me-2">✓</span>
                    <strong>Integridad:</strong> Somos transparentes en nuestros procesos y honestos con nuestros clientes.
                  </li>
                  <li className="d-flex align-items-center mb-3">
                    <span className="text-success me-2">✓</span>
                    <strong>Innovación:</strong> Buscamos constantemente nuevas formas de mejorar nuestros productos mientras mantenemos su esencia natural.
                  </li>
                  <li className="d-flex align-items-center mb-3">
                    <span className="text-success me-2">✓</span>
                    <strong>Sostenibilidad:</strong> Nos comprometemos con prácticas responsables con el medio ambiente.
                  </li>
                  <li className="d-flex align-items-center">
                    <span className="text-success me-2">✓</span>
                    <strong>Comunidad:</strong> Apoyamos la salud y bienestar de nuestra comunidad a través de la educación nutricional.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Banner de compromiso */}
        <div className="bg-success text-white p-4 p-md-5 rounded-lg shadow-sm mt-5">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h3 className="h4 fw-bold mb-3">Nuestro compromiso con tu salud</h3>
              <p className="mb-lg-0">
                En ComelonesFit nos apasiona la vida saludable. Creemos firmemente que una buena alimentación 
                es la base de un bienestar integral. Te invitamos a conocer más sobre nuestros productos y a 
                formar parte de nuestra comunidad.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <a href="/services" className="btn btn-light text-success px-4 py-2 fw-semibold">
                Ver nuestros productos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;