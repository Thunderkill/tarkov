interface ApiResponse<T> {
    error: number;
    errormsg: string;
    data: T;
  }
  

interface WeatherData {
  weather: Weather;
  date: string;
  time: string;
  acceleration: number;
}

interface Weather {
  timestamp: number;
  cloud: number;
  wind_speed: number;
  wind_direction: number;
  wind_gustiness: number;
  rain: number;
  rain_intensity: number;
  fog: number;
  temp: number;
  pressure: number;
  date: string;
  time: string;
}

interface Localization {
  interface: Map<string, string>;
  enum: any;
  error: Map<string, string>;
  mail: Map<string, string>;
  quest: Map<string, Quest>;
  preset: Map<string, Preset>;
  handbook: Map<string, string>;
  season: Map<string, string>;
  templates: Map<string, ItemLocalization>;
  locations: Map<string, LocationLocalization>;
  banners: Map<string, BannerLocalization>;
  trading: Map<string, TraderLocalization>;
}

interface Preset {
  name?: string;
}

interface ItemLocalization {
  name: string;
  shortName: string;
  description: string;
}
interface LocationLocalization {
  name: string;
  description: string;
}

interface BannerLocalization {
  name?: string;
  description?: string;
}

interface TraderLocalization {
  fullName: string;
  firstName: string;
  nickname: string;
  location: string;
  description: string;
}
