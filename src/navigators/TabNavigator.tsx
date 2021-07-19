import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  AppState,
  Appearance,
  Platform,
  StyleSheet,
  AppStateStatus,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Geolocation from 'react-native-geolocation-service';
import Permissions, { PERMISSIONS } from 'react-native-permissions';
import { useTranslation } from 'react-i18next';

import PlaceholderScreen from '../screens/PlaceHolderScreen';
import OthersScreen from '../screens/OthersScreen';
import MapScreen from '../screens/MapScreen';
import SymbolsScreen from '../screens/SymbolsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SearchScreen from '../screens/SearchScreen';

import Icon from '../components/Icon';

import { State } from '../store/types';
import { selectGeolocation } from '../store/general/selectors';
import { selectTheme } from '../store/settings/selectors';
import { setGeolocation as setGeolocationAction } from '../store/general/actions';
import { initSettings as initSettingsAction } from '../store/settings/actions';

import { TabParamList, OthersStackParamList } from './types';
import { PRIMARY_BLUE } from '../utils/colors';

import { lightTheme, darkTheme } from './themes';

const mapStateToProps = (state: State) => ({
  geolocation: selectGeolocation(state),
  theme: selectTheme(state),
});

const mapDispatchToProps = {
  setGeolocation: setGeolocationAction,
  initSettings: initSettingsAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  initialColorScheme?: string | null;
};

const Tab = createBottomTabNavigator<TabParamList>();
const MapStack = createStackNavigator();
const ForecastStack = createStackNavigator();
const OthersStack = createStackNavigator<OthersStackParamList>();
const WarningsStack = createStackNavigator();

const Navigator: React.FC<Props> = ({
  initSettings,
  setGeolocation,
  initialColorScheme,
  theme,
}) => {
  const { t, ready } = useTranslation(['navigation', 'placeholder'], {
    useSuspense: false,
  });
  const [useDarkTheme, setUseDarkTheme] = useState<boolean>(
    initialColorScheme === 'dark'
  );

  useEffect(() => {
    initSettings();
  }, [initSettings]);

  useEffect(() => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_ALWAYS
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    Permissions.request(permission).then((result) => {
      console.log('yes to location', result);
    });
  }, []);

  useEffect(() => {
    // TODO: adjust location when moving
    Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('GELOCATION', position);
        setGeolocation({ latitude, longitude });
      },
      (error) => {
        console.log('GEOLOCATION NOT AVAILABLE', error);
      },
      {
        // shows location indicator on iOS
        showsBackgroundLocationIndicator: true,
        // https://github.com/Agontuk/react-native-geolocation-service/blob/master/docs/accuracy.md#android
        accuracy: {
          android: 'low', // city level accuracy
          ios: 'reduced', // used when app doesn't need accurate location data
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAppStateChange = (state: AppStateStatus) => {
    if (state === 'active' && theme === 'automatic') {
      // getColorScheme() returns 'light' on iOS debug mode
      if (Appearance.getColorScheme() === 'dark') {
        setUseDarkTheme(true);
      } else {
        setUseDarkTheme(false);
      }
    }
  };

  useEffect(() => {
    if (theme === 'dark' && !useDarkTheme) {
      setUseDarkTheme(true);
    }
    if (theme === 'light' && useDarkTheme) {
      setUseDarkTheme(false);
    }
    if (theme === 'automatic') {
      if (Appearance.getColorScheme() === 'dark') {
        setUseDarkTheme(true);
      } else {
        setUseDarkTheme(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  if (!ready) return <ActivityIndicator size="large" />;

  const ForecastScreen = () => (
    <PlaceholderScreen
      text={`${t('placeholder:weather')}`}
      showLocation
      testIndex={1}
    />
  );
  const WarningsScreen = () => (
    <PlaceholderScreen text={`${t('placeholder:warnings')}`} testIndex={2} />
  );
  const AboutScreen = () => (
    <PlaceholderScreen text={`${t('placeholder:about')}`} testIndex={3} />
  );

  const NotificationsScreen = () => (
    <PlaceholderScreen
      text={`${t('placeholder:notifications')}`}
      testIndex={6}
    />
  );

  const MapStackScreen = () => (
    <MapStack.Navigator>
      <MapStack.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <MapStack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerBackTitleVisible: false,
          headerTitle: '',
          headerStyle: { shadowColor: 'transparent' },
          headerTintColor: PRIMARY_BLUE,
          headerBackImage: ({ tintColor }) => (
            <Icon
              name="arrow-back"
              style={{ color: tintColor, ...styles.headerBackButton }}
              width={26}
              height={26}
            />
          ),
        }}
      />
    </MapStack.Navigator>
  );

  const ForecastStackScreen = () => (
    <ForecastStack.Navigator>
      <ForecastStack.Screen
        name="Forecast"
        component={ForecastScreen}
        options={{ headerShown: false }}
      />
    </ForecastStack.Navigator>
  );

  const WarningsStackScreen = () => (
    <WarningsStack.Navigator>
      <WarningsStack.Screen
        name="Warnings"
        component={WarningsScreen}
        options={{ headerShown: false }}
      />
    </WarningsStack.Navigator>
  );

  const OthersStackScreen = () => (
    <OthersStack.Navigator initialRouteName="Others">
      <OthersStack.Screen
        name="Others"
        component={OthersScreen}
        options={{ headerTitle: `${t('navigation:others')}` }}
      />
      <OthersStack.Screen
        name="About"
        component={AboutScreen}
        options={{
          headerTitle: `${t('navigation:about')}`,
        }}
      />
      <OthersStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerTitle: `${t('navigation:settings')}`,
        }}
      />
      <OthersStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerTitle: `${t('navigation:notifications')}` }}
      />
      <OthersStack.Screen
        name="Symbols"
        component={SymbolsScreen}
        options={{
          headerTitle: `${t('navigation:symbols')}`,
        }}
      />
    </OthersStack.Navigator>
  );
  console.log(useDarkTheme);
  return (
    <NavigationContainer theme={useDarkTheme ? darkTheme : lightTheme}>
      <Tab.Navigator initialRouteName="Map">
        <Tab.Screen
          name="Map"
          component={MapStackScreen}
          options={{
            tabBarTestID: 'navigation_map',
            tabBarLabel: `${t('navigation:map')}`,
            tabBarIcon: ({ color, size }) => (
              <Icon name="map" style={{ color }} width={size} height={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Forecast"
          component={ForecastStackScreen}
          options={{
            tabBarTestID: 'navigation_forecast',
            tabBarLabel: `${t('navigation:weather')}`,
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="weather"
                style={{ color }}
                width={size}
                height={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Warnings"
          component={WarningsStackScreen}
          options={{
            tabBarTestID: 'navigation_warnings',
            tabBarLabel: `${t('navigation:warnings')}`,
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="warnings"
                style={{ color }}
                width={size}
                height={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Others"
          component={OthersStackScreen}
          options={{
            tabBarTestID: 'navigation_others',
            tabBarLabel: `${t('navigation:others')}`,
            tabBarIcon: ({ color, size }) => (
              <Icon name="menu" style={{ color }} width={size} height={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerBackButton: {
    marginLeft: 20,
  },
});

export default connector(Navigator);
