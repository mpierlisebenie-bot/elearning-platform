import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService, WeatherResponse } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  /**
   * GET /weather — météo actuelle (public)
   * Paramètres optionnels : ?lat=14.69&lon=-17.44&ville=Dakar
   * Sans paramètres → Dakar, Sénégal.
   */
  @Get()
  getWeather(
    @Query('lat') lat?: string,
    @Query('lon') lon?: string,
    @Query('ville') ville?: string,
  ): Promise<WeatherResponse> {
    const latitude = lat !== undefined ? parseFloat(lat) : undefined;
    const longitude = lon !== undefined ? parseFloat(lon) : undefined;
    return this.weatherService.getCurrentWeather(latitude, longitude, ville);
  }
}
