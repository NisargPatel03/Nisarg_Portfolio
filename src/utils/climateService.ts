export interface ClimateData {
  latitude: number;
  longitude: number;
  temperature: number;
  weatherCode: number;
  conditionText: string;
  locationName: string;
  isNight: boolean;
  isRainy: boolean;
  isSnowy: boolean;
  isSunny: boolean;
}

type ClimateListener = (data: ClimateData) => void;

class ClimateService {
  private data: ClimateData = {
    latitude: 22.3072, // Default Vadodara, Gujarat
    longitude: 73.1812,
    temperature: 28.0,
    weatherCode: 0,
    conditionText: 'Clear',
    locationName: 'Vadodara, IN (Default)',
    isNight: false,
    isRainy: false,
    isSnowy: false,
    isSunny: true,
  };

  private overrideData: Partial<ClimateData> | null = null;
  private listeners = new Set<ClimateListener>();
  private pollIntervalId: any = null;

  constructor() {
    this.updateNightState();
  }

  private updateNightState() {
    const hour = new Date().getHours();
    this.data.isNight = hour >= 19 || hour <= 6;
  }

  public async init() {
    this.updateNightState();
    await this.fetchWeather();
    
    // Start periodic polling every 15 minutes
    if (typeof window !== 'undefined') {
      this.pollIntervalId = setInterval(() => {
        this.updateNightState();
        this.fetchWeather();
      }, 15 * 60 * 1000);
    }
  }

  public destroy() {
    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
    }
  }

  public subscribe(listener: ClimateListener) {
    this.listeners.add(listener);
    listener(this.getEffectiveData());
    return () => this.unsubscribe(listener);
  }

  public unsubscribe(listener: ClimateListener) {
    this.listeners.delete(listener);
  }

  private notify() {
    const effective = this.getEffectiveData();
    this.listeners.forEach((listener) => {
      try {
        listener(effective);
      } catch (e) {
        console.error('Error notifying climate listener:', e);
      }
    });
  }

  public setOverride(override: Partial<ClimateData> | null) {
    if (override === null) {
      this.overrideData = null;
    } else {
      this.overrideData = { ...this.overrideData, ...override };
    }
    this.notify();
  }

  public getEffectiveData(): ClimateData {
    if (this.overrideData) {
      return { ...this.data, ...this.overrideData };
    }
    return this.data;
  }

  private getConditionText(code: number): string {
    if (code === 0) return 'Clear Sky';
    if (code === 1 || code === 2 || code === 3) return 'Partly Cloudy';
    if (code === 45 || code === 48) return 'Foggy';
    if (code >= 51 && code <= 55) return 'Light Drizzle';
    if (code >= 56 && code <= 57) return 'Freezing Drizzle';
    if (code >= 61 && code <= 65) return 'Rainy';
    if (code >= 66 && code <= 67) return 'Freezing Rain';
    if (code >= 71 && code <= 75) return 'Snowy';
    if (code === 77) return 'Snow Grains';
    if (code >= 80 && code <= 82) return 'Rain Showers';
    if (code >= 85 && code <= 86) return 'Snow Showers';
    if (code >= 95 && code <= 99) return 'Thunderstorm';
    return 'Unknown';
  }

  private isRainCode(code: number): boolean {
    // Drizzle, rain, freezing rain, rain showers, thunderstorm
    return (
      (code >= 51 && code <= 67) ||
      (code >= 80 && code <= 82) ||
      (code >= 95 && code <= 99)
    );
  }

  private isSnowCode(code: number): boolean {
    return (code >= 71 && code <= 77) || (code >= 85 && code <= 86);
  }

  private isSunCode(code: number): boolean {
    return code >= 0 && code <= 2;
  }

  public async fetchWeather() {
    let lat = this.data.latitude;
    let lon = this.data.longitude;
    let locationName = 'Vadodara, IN';

    try {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            maximumAge: 10 * 60 * 1000,
          });
        });
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        locationName = 'Local Coordinates';
      }
    } catch (err) {
      console.log('Using default coordinates (Vadodara) due to location access limits:', err);
    }

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      if (!response.ok) throw new Error('Weather fetch response error');
      const result = await response.json();
      
      if (result.current_weather) {
        const cw = result.current_weather;
        this.data = {
          latitude: lat,
          longitude: lon,
          temperature: cw.temperature,
          weatherCode: cw.weathercode,
          conditionText: this.getConditionText(cw.weathercode),
          locationName,
          isNight: this.data.isNight, // Retain local hour check
          isRainy: this.isRainCode(cw.weathercode),
          isSnowy: this.isSnowCode(cw.weathercode),
          isSunny: this.isSunCode(cw.weathercode),
        };
        this.notify();
      }
    } catch (err) {
      console.warn('Weather sync error, using static fallback values:', err);
      // Ensure we still notify listeners of the default state
      this.notify();
    }
  }
}

export const climateService = new ClimateService();
climateService.init().catch(console.error);
