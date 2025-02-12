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

export async function obtenerResultadosDeportivos() {
  try {
// Primero intenta obtener de la base de datos
    const response = await fetch('/api/resultados-deportivos/');
    const resultadosDB = await response.json();
        
    if (resultadosDB && resultadosDB.length > 0) 
    {
      return resultadosDB;
    }
// Si no hay datos en DB, obtén de ESPN
    const resultados = []
        
    for (const sport of Object.values(SPORTS_CONFIG)) {
      for (const league of sport.leagues) {
        try {
          const url = `https://site.api.espn.com/apis/site/v2/sports/${sport.sport}/${league}/scoreboard`;
          const response = await fetchWithTimeout(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (!data.events) {
            console.warn(`No hay eventos para la liga ${league}`);
            continue;
          }
          data.events.forEach(event => {const status = event.status.type.state;
          if (status === 'in' || status === 'post') 
          {
            const local = event.competitions[0].competitors[0];
            const visitante = event.competitions[0].competitors[1];
            resultados.push({
              deporte: sport.sport,
              equipoLocal: local.team.abbreviation || local.team.shortDisplayName,
              equipoVisitante: visitante.team.abbreviation || visitante.team.shortDisplayName,
              resultado: `${local.score}-${visitante.score}`,
              enVivo: status === 'in'});
          }
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
      return resultados;
    }
  } catch (error) {
    console.error('Error general en obtenerResultadosDeportivos:', error);
    throw error;
  }
}
