import React, { useState, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '@react-navigation/native';

import Icon from '@components/common/Icon';

import { MapStackParamList, WeatherStackParamList } from '@navigators/Types';

import { State } from '@store/types';

import {
  selectRecent,
  selectFavorites,
  selectSearch,
} from '@store/location/selector';

import {
  addFavorite as addFavoriteAction,
  deleteFavorite as deleteFavoriteAction,
  deleteAllFavorites as deleteAllFavoritesAction,
  updateRecentSearches as updateRecentSearchesAction,
  deleteAllRecentSearches as deleteAllRecentSearchesAction,
  setCurrentLocation as setCurrentLocationAction,
  searchLocation as searchLocationAction,
  resetSearch as resetSearchAction,
} from '@store/location/actions';
import { Location } from '@store/location/types';
import { setAnimateToArea as setAnimateToAreaAction } from '@store/map/actions';

import AreaList from '@components/search/AreaList';
import IconButton from '@components/common/IconButton';

import { getGeolocation } from '@utils/helpers';
import { CustomTheme } from '@utils/colors';

const MAX_RECENT_SEARCHES = 5; // TODO: define max number of recent searches

const mapStateToProps = (state: State) => ({
  favorites: selectFavorites(state),
  recent: selectRecent(state),
  search: selectSearch(state),
});

const mapDispatchToProps = {
  addFavorite: addFavoriteAction,
  deleteFavorite: deleteFavoriteAction,
  deleteAllFavorites: deleteAllFavoritesAction,
  setAnimateToArea: setAnimateToAreaAction,
  updateRecentSearches: updateRecentSearchesAction,
  deleteAllRecentSearches: deleteAllRecentSearchesAction,
  setCurrentLocation: setCurrentLocationAction,
  searchLocation: searchLocationAction,
  resetSearch: resetSearchAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type SearchScreenProps = PropsFromRedux & {
  navigation: StackNavigationProp<
    MapStackParamList | WeatherStackParamList,
    'Search'
  >;
};

const SearchScreen: React.FC<SearchScreenProps> = ({
  favorites,
  recent,
  search,
  addFavorite,
  deleteFavorite,
  deleteAllFavorites,
  setAnimateToArea,
  updateRecentSearches,
  deleteAllRecentSearches,
  setCurrentLocation,
  searchLocation,
  resetSearch,
  navigation,
}) => {
  // TODO: for some reason this renders twice...
  const { t } = useTranslation('searchScreen');
  const { colors } = useTheme() as CustomTheme;
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value) {
      searchLocation(value);
    } else {
      resetSearch();
    }
  }, [value, searchLocation, resetSearch]);

  const handleSelectLocation = (location: Location, update: boolean) => {
    Keyboard.dismiss();
    setAnimateToArea(true);
    setValue('');

    if (update) {
      updateRecentSearches(location, MAX_RECENT_SEARCHES);
    }

    setCurrentLocation(location);
    navigation.goBack();
  };

  const isFavorite = (location: Location) =>
    favorites.length > 0 && favorites.some(({ id }) => id === location.id);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.searchBoxContainer,
          { backgroundColor: colors.inputBackground },
        ]}>
        <Icon
          name="search"
          width={22}
          height={22}
          style={[styles.searchIcon, { color: colors.text }]}
        />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          autoCorrect={false}
          maxLength={40}
          placeholder={t('placeholder')}
          placeholderTextColor={colors.text}
          value={value}
          onChangeText={(text) => setValue(text)}
          underlineColorAndroid="transparent"
        />
      </View>
      {search.length === 0 && (
        <View style={styles.locateRow}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('locate')}
          </Text>
          <IconButton
            icon="locate"
            iconColor={colors.text}
            backgroundColor={colors.inputBackground}
            accessibilityLabel={t('locate')}
            onPress={() => {
              getGeolocation(setCurrentLocation, t);
              navigation.goBack();
            }}
          />
        </View>
      )}
      <View style={styles.results}>
        {search.length > 0 && (
          <AreaList
            elements={search}
            title={t('searchResults')}
            onSelect={(location) => handleSelectLocation(location, true)}
            onIconPress={(location) => {
              addFavorite(location as Location);
              setValue('');
              Keyboard.dismiss();
            }}
            iconNameGetter={(location) =>
              isFavorite(location) ? 'star-selected' : 'star-unselected'
            }
          />
        )}
        {/^\s*$/.test(value) && search.length === 0 && favorites.length > 0 && (
          <AreaList
            elements={favorites}
            title={t('favorites')}
            onSelect={(location) => handleSelectLocation(location, false)}
            onIconPress={(location) => {
              deleteFavorite(location.id);
              updateRecentSearches(location, MAX_RECENT_SEARCHES);
            }}
            iconName="star-selected"
            clearTitle={t('clearFavorites')}
            onClear={() => deleteAllFavorites()}
          />
        )}
        {/^\s*$/.test(value) && search.length === 0 && recent.length > 0 && (
          <AreaList
            elements={recent.slice(0).reverse()}
            title={t('recentSearches')}
            onSelect={(location) => handleSelectLocation(location, false)}
            onIconPress={(location) =>
              isFavorite(location)
                ? deleteFavorite(location.id)
                : addFavorite(location)
            }
            iconNameGetter={(location) =>
              isFavorite(location) ? 'star-selected' : 'star-unselected'
            }
            clearTitle={t('clearRecentSearches')}
            onClear={() => deleteAllRecentSearches()}
          />
        )}

        {!/^\s*$/.test(value) && search.length === 0 && (
          <Text style={{ color: colors.text }}>{t('noResults')}</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  searchBoxContainer: {
    height: 48,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  searchIcon: {
    marginRight: 8,
  },
  results: {
    flex: 1,
    marginBottom: 10,
  },
  input: {
    height: '100%',
    flexGrow: 1,
    paddingVertical: 0,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  locateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    marginTop: 12,
    height: 44,
  },
});

export default connector(React.memo(SearchScreen));
