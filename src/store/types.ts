import { ForecastState } from './forecast/types';
import { ObservationState } from './observation/types';
import { SettingsState } from './settings/types';
import { MapState } from './map/types';
import { LocationState } from './location/types';
import { NavigationState } from './navigation/types';
import { WarningsState } from './warnings/types';

export interface State {
  settings: SettingsState;
  forecast: ForecastState;
  observation: ObservationState;
  map: MapState;
  location: LocationState;
  navigation: NavigationState;
  warnings: WarningsState;
}

export interface PersistConfig {
  key: string;
  whitelist: string[];
}
