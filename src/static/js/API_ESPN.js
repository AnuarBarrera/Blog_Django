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

const SPORTS_CONFIG = {
  soccer: {
    sport: 'soccer',
    leagues: ['esp.1', 'eng.1', 'mex.1']
  },
  basketball: {
    sport: 'basketball',
    leagues: ['nba']
  },
  baseball: {
    sport: 'baseball',
    leagues: ['mlb']
  },
  football: {
    sport: 'football',
    leagues: ['nfl']
  }
};

function getDateRange() {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 2);
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 2);


  // Formato YYYYMMDD que requiere ESPN
  function formatDate(date) {
    return date.toISOString().split('T')[0].replace(/-/g, '');
  }

  return {
    start: formatDate(pastDate),
    end: formatDate(futureDate)
  };
}

const fetchWithTimeout = async (url, timeout = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    console.log('Iniciando fetch para:', url);
    const response = await fetch(url, { 
      signal: controller.signal,
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    console.error('Error en fetchWithTimeout:', {
      url,
      errorMessage: error.message,
      errorName: error.name
    });
    throw error;
  }
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
let lastFetchTime = 0;
let cachedResults = null;

export async function obtenerResultadosDeportivos() {
  
// Si tenemos datos en caché y no han pasado 5 minutos
  if (cachedResults && (Date.now() - lastFetchTime) < CACHE_DURATION) {
    return cachedResults;
  }
  
  try {
// Primero intenta obtener de la base de datos
    
    // *** Paso 1: Ejecutar limpieza de resultados antiguos ***
    console.log('Eliminando resultados antiguos...');
    await fetch('/api/limpiar-resultados/', { method: 'POST' });
    
    //log temporal
    console.log('Iniciando obtención de resultados');
    
    const response = await fetch('/api/resultados-deportivos/');
    const resultadosDB = await response.json();
    
    //log temporal
    console.log('Resultados de DB:', resultadosDB);
    
    if (resultadosDB && resultadosDB.length > 0) 
    {
      return resultadosDB;
    }
  
  //log temporal
  console.log('No hay datos en DB, intentando obtener de ESPN');
  
// Si no hay datos en DB, obtén de ESPN
    const resultados = []
    const dateRange = getDateRange();
        
    for (const sport of Object.values(SPORTS_CONFIG)) {
      for (const league of sport.leagues) {
        try {
          const dateRange = getDateRange();
          const url = `https://site.api.espn.com/apis/site/v2/sports/${sport.sport}/${league}/scoreboard?dates=${dateRange.start}-${dateRange.end}`;
          console.log('Intentando obtener datos de:', url);
          const response = await fetchWithTimeout(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (!data.events) {
            console.warn(`No hay eventos para la liga ${league}`);
            continue;
          }
          data.events.forEach(event => {
            const status = event.status.type.state;
            const fecha = new Date(event.date);
            const local = event.competitions[0].competitors[0];
            const visitante = event.competitions[0].competitors[1];
// Procesamos todos los eventos (pasados, en vivo y futuros)
            resultados.push({
              deporte: sport.sport,
              equipoLocal: local.team.abbreviation || local.team.shortDisplayName,
              equipoVisitante: visitante.team.abbreviation || visitante.team.shortDisplayName,
              resultado: status === 'pre' ? 'vs' : `${local.score}-${visitante.score}`,
              enVivo: status === 'in',
              estado: status, // 'pre' para futuros, 'in' para en vivo, 'post' para terminados
              fecha: fecha.toISOString(),
              hora: fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
            });
          });
        } catch (leagueError) {
          console.error(`Error al obtener datos de la liga ${league}:`, leagueError);
          continue;
        }
      }
    }
//Si obtuvimos resultados, los guardamos en la base de datos
    if (resultados.length > 0) {
      await fetch('/api/resultados-deportivos/',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultados)
      });

  // Actualizar caché
      lastFetchTime = Date.now();
      cachedResults = resultados;
      
      return resultados;
    }
  } catch (error) {
    console.error('Error general en obtenerResultadosDeportivos:', error);
    throw error;
  }
}
