import { obtenerResultadosDeportivos } from '/static/js/API_ESPN.js'

// Configuración de la API
function obtenerIconoDeporte(deporte) {
  const iconos = {
    soccer: '⚽',
    basketball: '🏀',
    baseball: '⚾',
    football: '🏈',
    default: '🎮'
  };
  return iconos[deporte] || iconos.default;
}


function actualizarBannerDeportivo(resultados) {
  const carrusel = document.querySelector('.banner-deportivo .carrusel');
  carrusel.innerHTML = '';
  
  if (!resultados || resultados.length === 0) {
    const mensajeError = document.createElement('div');
    mensajeError.className = 'partido mensaje-error';
    mensajeError.innerHTML = `
      <span class="deporte-icon">⚠️</span>
      <span class="mensaje">No hay resultados disponibles en este momento</span>
    `;
    carrusel.appendChild(mensajeError);
    return;
  }

  // Eliminar el estilo anterior si existe
  const oldStyle = document.getElementById('banner-animation-style');
  if (oldStyle) {
    oldStyle.remove();
  }

  const duracionPorResultado = 5;
  const duracionTotal = resultados.length * duracionPorResultado;
  
  // Crear nuevo elemento de estilo
  const styleElement = document.createElement('style');
  styleElement.id = 'banner-animation-style';
  
  // Definir la animación base
  let cssRules = `
    @keyframes slide-item {
      0%, 5% {
        transform: translateX(100%);
        opacity: 0;
      }
      10%, 40% {
        transform: translateX(0);
        opacity: 1;
      }
      45%, 100% {
        transform: translateX(-100%);
        opacity: 0;
      }
    }
  `;
  
  // Crear los elementos del partido
  resultados.forEach((partido, index) => {
    const partidoElement = document.createElement('div');
    partidoElement.className = 'partido';
    const deporteIcon = obtenerIconoDeporte(partido.deporte);
    
    partidoElement.innerHTML = `
      <span class="deporte-icon">${deporteIcon}</span>
      <span class="equipo-local">${partido.equipoLocal}</span>
      <span class="resultado ${partido.enVivo ? 'en-vivo' : ''}">${partido.resultado}</span>
      <span class="equipo-visitante">${partido.equipoVisitante}</span>
    `;
    
    // Calcular el delay para cada elemento
    const delay = index * duracionPorResultado;
    
    // Agregar reglas específicas para este elemento
    cssRules += `
      .banner-deportivo .carrusel .partido:nth-child(${index + 1}) {
        animation: slide-item ${duracionTotal}s linear infinite;
        animation-delay: -${delay}s;
      }
    `;
    
    carrusel.appendChild(partidoElement);
  });
  
  styleElement.textContent = cssRules;
  document.head.appendChild(styleElement);
}

async function inicializarBannerDeportivo() {
  const carrusel = document.querySelector('.banner-deportivo .carrusel');
  
  carrusel.innerHTML = `
    <div class="partido estado-carga">
      <span class="deporte-icon">⌛</span>
      <span class="mensaje">Cargando resultados deportivos...</span>
    </div>
  `;
  
  try {
    const resultados = await obtenerResultadosDeportivos();
    
    if (!resultados || resultados.length === 0) {
      throw new Error('No se obtuvieron resultados');
    }
    
    actualizarBannerDeportivo(resultados);
    
    setInterval(async () => {
      try {
        const nuevosResultados = await obtenerResultadosDeportivos();
        actualizarBannerDeportivo(nuevosResultados);
      } catch (error) {
        console.error('Error en la actualización automática:', error);
      }
    }, 15 * 60 * 1000);
    
  } catch (error) {
    console.error('Error en la inicialización del banner:', error);
    carrusel.innerHTML = `
      <div class="partido estado-error">
        <span class="deporte-icon">❌</span>
        <span class="mensaje">Error al cargar los resultados deportivos: ${error.message}</span>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", inicializarBannerDeportivo);