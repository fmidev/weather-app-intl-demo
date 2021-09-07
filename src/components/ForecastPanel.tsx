import React, { useState, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import 'moment/locale/fi';
import 'moment/locale/en-gb';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { State } from '../store/types';

import {
  selectLoading,
  selectForecastByDay,
  selectHeaderLevelForecast,
  selectForecastLastUpdatedMoment,
} from '../store/forecast/selectors';

import ForecastByHourList from './ForecastByHourList';
import Icon from './Icon';
import CollapsibleChartList from './CollapsibleChartList';

import { weatherSymbolGetter } from '../assets/images';
import { WHITE, CustomTheme } from '../utils/colors';

const TABLE = 'table';
const CHART = 'chart';

const mapStateToProps = (state: State) => ({
  loading: selectLoading(state),
  forecastByDay: selectForecastByDay(state),
  headerLevelForecast: selectHeaderLevelForecast(state),
  forecastLastUpdatedMoment: selectForecastLastUpdatedMoment(state),
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

type ForecastPanelProps = PropsFromRedux;

const ForecastPanel: React.FC<ForecastPanelProps> = ({
  loading,
  forecastByDay,
  forecastLastUpdatedMoment,
  headerLevelForecast,
}) => {
  const { colors, dark } = useTheme() as CustomTheme;
  const { t, i18n } = useTranslation('forecast');
  const locale = i18n.language;
  const [dayOpenIndexes, setDayOpenIndexes] = useState<number[]>([]);
  const [toDisplay, setToDisplay] = useState<typeof TABLE | typeof CHART>(
    TABLE
  );
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );

  const dateKeys = Object.keys(forecastByDay);

  useEffect(() => {
    if (forecastByDay) {
      if (dateKeys.length > 0 && !selectedDate) {
        setSelectedDate(dateKeys[0]);
      }
    }
  }, [forecastByDay, dateKeys, selectedDate]);

  const forecastLastUpdated =
    forecastLastUpdatedMoment &&
    forecastLastUpdatedMoment.format(`D.M. [${t('at')}] HH:mm`);

  return (
    <View
      style={[
        styles.panelWrapper,
        {
          backgroundColor: colors.background,
          shadowColor: colors.cardShadow,
        },
      ]}>
      <View
        style={[styles.panelHeader, { backgroundColor: colors.cardHeader }]}>
        <Text style={[styles.headerTitle, { color: WHITE }]}>
          {t('panelHeader')}
        </Text>
      </View>
      <View style={styles.panelContainer}>
        <Text style={[styles.panelText, { color: colors.primaryText }]}>
          {t('lastUpdated')}{' '}
          <Text style={styles.bold}>{forecastLastUpdated}</Text>
        </Text>
      </View>
      <View style={styles.panelContainer}>
        <View style={[styles.row, styles.justifyStart]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setToDisplay(TABLE)}>
            <Text
              style={[
                styles.forecastText,
                styles.medium,
                styles.withMarginRight,
                toDisplay === TABLE && styles.selectedText,
                {
                  color: colors.primaryText,
                },
              ]}>
              {t('table')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setToDisplay(CHART)}>
            <Text
              style={[
                styles.forecastText,
                styles.medium,
                toDisplay === CHART && styles.selectedText,
                { color: colors.primaryText },
              ]}>
              {t('chart')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.forecastContainer]}>
        {loading && <ActivityIndicator />}
        {headerLevelForecast &&
          headerLevelForecast.length > 0 &&
          toDisplay === TABLE &&
          headerLevelForecast.map((dayStep, index) => {
            const stepMoment = moment.unix(dayStep.epochtime);
            const temperaturePrefix = dayStep.temperature > 0 && '+';
            const smartSymbol = weatherSymbolGetter(
              dayStep.smartSymbol.toString(),
              dark
            );
            return (
              <View key={dayStep.epochtime}>
                <TouchableOpacity
                  activeOpacity={1}
                  // delayPressIn={100}
                  accessibilityLabel={
                    !dayOpenIndexes.includes(index)
                      ? `${t(
                          'hourListOpenAccessibilityLabel'
                        )} ${stepMoment.locale(locale).format('ddd D.M.')}`
                      : `${t(
                          'hourListCloseAccessibilityLabel'
                        )} ${stepMoment.locale(locale).format('ddd D.M.')}`
                  }
                  onPress={() => {
                    if (dayOpenIndexes.includes(index)) {
                      setDayOpenIndexes(
                        dayOpenIndexes.filter((i) => i !== index)
                      );
                    } else {
                      setDayOpenIndexes(dayOpenIndexes.concat(index));
                    }
                  }}>
                  <View
                    style={[
                      styles.row,
                      styles.forecastHeader,
                      {
                        borderBottomColor: colors.border,
                        backgroundColor: colors.inputBackground,
                      },
                    ]}>
                    <View style={[styles.rowColumn, styles.alignStart]}>
                      <Text
                        style={[
                          styles.headerTitle,
                          {
                            color: colors.primaryText,
                          },
                        ]}>
                        {stepMoment.locale(locale).format('ddd D.M.')}
                      </Text>
                    </View>
                    <View style={styles.rowColumn}>
                      <Text
                        style={[
                          styles.forecastText,
                          { color: colors.primaryText },
                        ]}>
                        {i18n.language === 'fi'
                          ? stepMoment.format('HH:mm')
                          : stepMoment.locale(locale).format('LT')}
                      </Text>
                    </View>
                    <View style={styles.rowColumn}>
                      <View>{smartSymbol?.({ width: 40, height: 40 })}</View>
                    </View>
                    <View style={styles.rowColumn}>
                      <Text
                        style={[
                          styles.temperature,
                          { color: colors.primaryText },
                        ]}>{`${temperaturePrefix}${dayStep.temperature}°`}</Text>
                    </View>

                    <Icon
                      width={24}
                      height={24}
                      name={
                        dayOpenIndexes.includes(index)
                          ? 'arrow-up'
                          : 'arrow-down'
                      }
                      style={{ color: colors.primaryText }}
                    />
                  </View>
                  {forecastByDay && dayOpenIndexes.includes(index) && (
                    <ForecastByHourList
                      dayForecast={forecastByDay[stepMoment.format('D.M.')]}
                      isOpen={dayOpenIndexes.includes(index)}
                    />
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        {headerLevelForecast &&
          headerLevelForecast.length > 0 &&
          toDisplay === CHART && (
            <CollapsibleChartList
              data={forecastByDay && forecastByDay[selectedDate!]}
              selectedDate={
                forecastByDay &&
                moment
                  .unix(forecastByDay[selectedDate!][0]?.epochtime)
                  .locale(locale)
                  .format('dddd D.M.')
              }
              showPreviousDay={() => {
                const index =
                  (!!selectedDate && dateKeys.indexOf(selectedDate) - 1) || 0;
                if (index >= 0 && dateKeys[index]) {
                  setSelectedDate(dateKeys[index]);
                }
              }}
              showNextDay={() => {
                const index =
                  !!selectedDate && dateKeys.indexOf(selectedDate) + 1;
                if (index && dateKeys[index]) {
                  setSelectedDate(dateKeys[index]);
                }
              }}
              showPreviousDisabled={
                !!selectedDate && dateKeys.indexOf(selectedDate) === 0
              }
              showNextDisabled={
                !!selectedDate &&
                dateKeys.indexOf(selectedDate) === dateKeys.length - 1
              }
            />
          )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panelWrapper: {
    borderRadius: 8,
    marginBottom: 8,
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
  },
  panelHeader: {
    height: 44,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    paddingVertical: 12,
    paddingLeft: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    textTransform: 'capitalize',
  },
  bold: {
    fontFamily: 'Roboto-Bold',
  },
  medium: {
    fontFamily: 'Roboto-Medium',
  },
  panelContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  panelText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  rowColumn: {
    flex: 1,
    alignItems: 'center',
  },
  forecastContainer: {
    marginHorizontal: 8,
    marginBottom: 8,
  },
  forecastHeader: {
    height: 56,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  forecastText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  temperature: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  selectedText: {
    fontFamily: 'Roboto-Bold',
    textDecorationLine: 'underline',
  },
  withMarginRight: {
    marginRight: 16,
  },
});

export default connector(ForecastPanel);
