import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';

import Icon from '@components/common/Icon';
import AccessibleTouchableOpacity from '@components/common/AccessibleTouchableOpacity';
import CloseButton from '@components/common/CloseButton';

import { State } from '@store/types';
import { selectDisplayParams } from '@store/forecast/selectors';
import {
  updateDisplayParams as updateDisplayParamsAction,
  restoreDefaultDisplayParams as restoreDefaultDisplayParamsAction,
} from '@store/forecast/actions';
import constants, {
  RELATIVE_HUMIDITY,
  PRESSURE,
  UV_CUMULATED,
  PARAMS_TO_ICONS,
} from '@store/forecast/constants';

import { useOrientation } from '@utils/hooks';
import {
  WHITE,
  SECONDARY_BLUE,
  GRAYISH_BLUE,
  CustomTheme,
} from '@utils/colors';
import { Config } from '@config';

const mapStateToProps = (state: State) => ({
  displayParams: selectDisplayParams(state),
});

const mapDispatchToProps = {
  updateDisplayParams: updateDisplayParamsAction,
  restoreDefaultDisplayParams: restoreDefaultDisplayParamsAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type ParamsBottomSheetProps = PropsFromRedux & {
  onClose: () => void;
};

const ParamsBottomSheet: React.FC<ParamsBottomSheetProps> = ({
  displayParams,
  updateDisplayParams,
  restoreDefaultDisplayParams,
  onClose,
}) => {
  const { t } = useTranslation('forecast');
  const { colors } = useTheme() as CustomTheme;
  const isLandscape = useOrientation();
  const {
    data,
    defaultParameters: [defaultParameter],
  } = Config.get('weather').forecast;
  const activeParameters = data.flatMap(({ parameters }) => parameters);

  const regex = new RegExp(activeParameters.join('|'));
  const activeConstants = constants.filter((constant) => regex.test(constant));

  const rowRenderer = (param: string, index: number) => (
    <View
      accessible
      accessibilityState={{
        selected: displayParams.some((arr) => arr.includes(param)),
      }}
      accessibilityHint={
        displayParams.some((arr) => arr.includes(param))
          ? t('paramsBottomSheet.unSelectAccessibilityHint')
          : t('paramsBottomSheet.selectAccessibilityHint')
      }
      onAccessibilityTap={() => updateDisplayParams([index, param])}
      key={param}
      style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={styles.innerRow}>
        {param !== RELATIVE_HUMIDITY &&
          param !== PRESSURE &&
          param !== UV_CUMULATED && (
            <Icon
              name={PARAMS_TO_ICONS[param]}
              style={styles.withMarginRight}
              color={colors.hourListText}
            />
          )}
        {param === RELATIVE_HUMIDITY && (
          <Text
            accessible={false}
            style={[
              styles.iconText,
              styles.withMarginRight,
              { color: colors.hourListText },
            ]}>
            RH%
          </Text>
        )}
        {param === PRESSURE && (
          <Text
            accessible={false}
            style={[
              styles.iconText,
              styles.withMarginRight,
              { color: colors.hourListText },
            ]}>
            hPa
          </Text>
        )}
        {param === UV_CUMULATED && (
          <Text
            accessible={false}
            style={[
              styles.iconText,
              styles.withMarginRight,
              { color: colors.hourListText },
            ]}>
            UV
          </Text>
        )}
        <Text style={[styles.text, { color: colors.hourListText }]}>
          {t(`paramsBottomSheet.${param}`)}
        </Text>
      </View>

      <Switch
        trackColor={{ false: GRAYISH_BLUE, true: SECONDARY_BLUE }}
        thumbColor={WHITE}
        ios_backgroundColor={GRAYISH_BLUE}
        value={displayParams.some((arr) => arr.includes(param))}
        onValueChange={() => updateDisplayParams([index, param])}
        disabled={param === defaultParameter}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.sheetListContainer}>
        <View style={styles.closeButtonContainer}>
          <CloseButton
            onPress={onClose}
            accessibilityLabel={t('paramsBottomSheet.closeAccessibilityLabel')}
          />
        </View>

        <View style={styles.sheetTitle}>
          <Text
            accessibilityRole="header"
            style={[styles.title, { color: colors.primaryText }]}>
            {t('paramsBottomSheet.title')}
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={isLandscape && styles.landscape}>
          <TouchableOpacity activeOpacity={1} accessible={false}>
            <View style={styles.descriptionContainer} accessible>
              <Text style={[styles.text, { color: colors.hourListText }]}>
                {t('paramsBottomSheet.subTitle')}
              </Text>
            </View>

            {activeConstants.map(rowRenderer)}
            <View style={styles.lastRow}>
              <AccessibleTouchableOpacity
                accessible
                accessibilityRole="button"
                accessibilityHint={t('restoreDefaultHint')}
                onPress={() => restoreDefaultDisplayParams()}>
                <Text
                  style={[
                    styles.restoreText,
                    {
                      color: colors.primaryText,
                    },
                  ]}>
                  {t('paramsBottomSheet.restoreButtonText')}
                </Text>
              </AccessibleTouchableOpacity>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  sheetListContainer: {
    flex: 1,
    marginTop: -10,
    paddingHorizontal: 20,
  },
  closeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sheetTitle: {
    flexDirection: 'row',
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  descriptionContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  innerRow: {
    flexDirection: 'row',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  withMarginRight: {
    marginRight: 10,
  },
  restoreText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  iconText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
  lastRow: {
    flex: 1,
    alignItems: 'flex-end',
    minHeight: 60,
    marginTop: 14,
  },
  landscape: {
    paddingBottom: 200,
  },
});

export default connector(ParamsBottomSheet);
