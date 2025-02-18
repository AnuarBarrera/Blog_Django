/*
  Copyright [2005] [anuar eduardo barrera yeeben]
 
 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0
 
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.
*/

import { obtenerResultadosDeportivos } from '/static/js/API_ESPN.js';

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

class BannerDeportivo {
  constructor() {
    this.currentIndex = 0;
    this.resultados = [];
    this.intervalId = null;
    this.duracionPorResultado = 5000; // 5 segundos por resultado
  }

  actualizarBanner(resultados) {
    this.resultados = resultados;
    const carrusel = document.querySelector('.banner-deportivo .carrusel');
    carrusel.innerHTML = '';
    
    if (!resultados || resultados.length === 0) {
      this.mostrarError(carrusel, 'No hay resultados disponibles en este momento');
      return;
    }

    // Crear elementos para cada resultado
    resultados.forEach((partido, index) => {
      const partidoElement = this.crearElementoPartido(partido);
      carrusel.appendChild(partidoElement);
    });

    // Iniciar rotación
    this.iniciarRotacion();
  }

  crearElementoPartido(partido) {
    const partidoElement = document.createElement('div');
    partidoElement.className = 'partido';
    const deporteIcon = obtenerIconoDeporte(partido.deporte);
    
    let resultadoTexto = partido.estado === 'pre' ? 'vs' : partido.resultado;
    
    partidoElement.innerHTML = `
      <span class="deporte-icon">${deporteIcon}</span>
      <span class="equipo-local">${partido.equipoLocal}</span>
      <span class="resultado ${partido.enVivo ? 'en-vivo' : ''}">${resultadoTexto}</span>
      <span class="equipo-visitante">${partido.equipoVisitante}</span>
      ${partido.estado === 'pre' ? `<span class="hora-partido">${partido.hora}</span>` : ''}
    `;
    
    return partidoElement;
  }

  mostrarError(carrusel, mensaje) {
    carrusel.innerHTML = `
      <div class="partido estado-error">
        <span class="deporte-icon">❌</span>
        <span class="mensaje">${mensaje}</span>
      </div>
    `;
  }

  actualizarClases() {
    const partidos = document.querySelectorAll('.banner-deportivo .partido');
    partidos.forEach((partido, index) => {
      partido.classList.remove('active', 'prev', 'next');
      if (index === this.currentIndex) {
        partido.classList.add('active');
      } else if (index === this.getPrevIndex()) {
        partido.classList.add('prev');
      } else if (index === this.getNextIndex()) {
        partido.classList.add('next');
      }
    });
  }

  getPrevIndex() {
    return this.currentIndex === 0 ? this.resultados.length - 1 : this.currentIndex - 1;
  }

  getNextIndex() {
    return this.currentIndex === this.resultados.length - 1 ? 0 : this.currentIndex + 1;
  }

  iniciarRotacion() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.actualizarClases();

    this.intervalId = setInterval(() => {
      this.currentIndex = this.getNextIndex();
      this.actualizarClases();
    }, this.duracionPorResultado);
  }

  async inicializar() {
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
      
      this.actualizarBanner(resultados);
      
      // Actualización periódica
      setInterval(async () => {
        try {
          const nuevosResultados = await obtenerResultadosDeportivos();
          this.actualizarBanner(nuevosResultados);
        } catch (error) {
          console.error('Error en la actualización automática:', error);
        }
      }, 15 * 60 * 1000); // 15 minutos
      
    } catch (error) {
      console.error('Error en la inicialización del banner:', error);
      this.mostrarError(carrusel, `Error al cargar los resultados deportivos: ${error.message}`);
    }
  }
}

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
  const banner = new BannerDeportivo();
  banner.inicializar();
});