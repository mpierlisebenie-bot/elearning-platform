import { Injectable, ServiceUnavailableException } from '@nestjs/common';

/**
 * WeatherService — Consommation d'une API externe (exigence de l'examen).
 *
 * API utilisée : Open-Meteo (https://open-meteo.com)
 * → gratuite, sans clé API, idéale pour afficher la météo sur le dashboard.
 *
 * Par défaut : Dakar, Sénégal (14.6928, -17.4467).
 */

// Codes météo WMO → description en français
const WEATHER_CODES: Record<number, { description: string; icone: string }> = {
  0: { description: 'Ciel dégagé', icone: '☀️' },
  1: { description: 'Plutôt dégagé', icone: '🌤️' },
  2: { description: 'Partiellement nuageux', icone: '⛅' },
  3: { description: 'Couvert', icone: '☁️' },
  45: { description: 'Brouillard', icone: '🌫️' },
  48: { description: 'Brouillard givrant', icone: '🌫️' },
  51: { description: 'Bruine légère', icone: '🌦️' },
  53: { description: 'Bruine modérée', icone: '🌦️' },
  55: { description: 'Bruine dense', icone: '🌧️' },
  61: { description: 'Pluie légère', icone: '🌧️' },
  63: { description: 'Pluie modérée', icone: '🌧️' },
  65: { description: 'Pluie forte', icone: '🌧️' },
  71: { description: 'Neige légère', icone: '🌨️' },
  73: { description: 'Neige modérée', icone: '🌨️' },
  75: { description: 'Neige forte', icone: '❄️' },
  80: { description: 'Averses légères', icone: '🌦️' },
  81: { description: 'Averses modérées', icone: '🌧️' },
  82: { description: 'Averses violentes', icone: '⛈️' },
  95: { description: 'Orage', icone: '⛈️' },
  96: { description: 'Orage avec grêle', icone: '⛈️' },
  99: { description: 'Orage avec grêle forte', icone: '⛈️' },
};

export interface WeatherResponse {
  ville: string;
  latitude: number;
  longitude: number;
  temperature: number;
  humidite: number;
  vitesseVent: number;
  description: string;
  icone: string;
  source: string;
}

@Injectable()
export class WeatherService {
  async getCurrentWeather(
    lat = 14.6928, // Dakar par défaut
    lon = -17.4467,
    ville = 'Dakar',
  ): Promise<WeatherResponse> {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
      `&timezone=auto`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Open-Meteo a répondu ${res.status}`);
      }
      const data = await res.json();
      const current = data.current;
      const code = WEATHER_CODES[current.weather_code] ?? {
        description: 'Conditions inconnues',
        icone: '🌡️',
      };

      return {
        ville,
        latitude: lat,
        longitude: lon,
        temperature: current.temperature_2m,
        humidite: current.relative_humidity_2m,
        vitesseVent: current.wind_speed_10m,
        description: code.description,
        icone: code.icone,
        source: 'Open-Meteo (API externe gratuite)',
      };
    } catch {
      throw new ServiceUnavailableException(
        'Impossible de contacter le service météo (Open-Meteo)',
      );
    }
  }
}
