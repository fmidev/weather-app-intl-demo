import React, { useState } from 'react';
import {
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Permissions, { PERMISSIONS } from 'react-native-permissions';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { SetupStackParamList } from '@navigators/types';

import {
  PRIMARY_BLUE,
  WHITE,
  SHADOW_LIGHT,
  GRAY_1,
  CustomTheme,
  SECONDARY_BLUE,
} from '@utils/colors';

type SetupScreenProps = {
  setUpDone: () => void;
  navigation: StackNavigationProp<SetupStackParamList, 'SetupScreen'>;
};

const SetupScreen: React.FC<SetupScreenProps> = ({ navigation, setUpDone }) => {
  const { t } = useTranslation('setUp');
  const { colors } = useTheme() as CustomTheme;
  const [didViewTerms, setDidViewTerms] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const requestLocationPermissions = () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_ALWAYS
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    Permissions.request(permission)
      .then((result) => {
        console.log('yes to location', result);
        setUpDone();
      })
      .catch((e) => console.error(e));
  };

  const PermissionComponent: React.FC<{
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    primaryButtonFirst?: boolean;
    onPrimaryButtonPress: () => void;
    onSecondaryButtonPress: () => void;
    primaryButtonDisabled: boolean;
  }> = ({
    title,
    description,
    primaryButtonText,
    secondaryButtonText,
    primaryButtonFirst,
    onPrimaryButtonPress,
    onSecondaryButtonPress,
    primaryButtonDisabled,
  }) => (
    <View style={styles.permissionContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.textNormal, { color: colors.hourListText }]}>
        {description}
      </Text>
      {!primaryButtonFirst ? (
        <>
          <TouchableOpacity onPress={onSecondaryButtonPress}>
            <View style={[styles.secondaryButton, styles.marginBottom20]}>
              <Text style={styles.textHighlight}>{secondaryButtonText}</Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.button, styles.marginBottom40]}>
            <TouchableOpacity
              onPress={onPrimaryButtonPress}
              accessibilityRole="button"
              disabled={primaryButtonDisabled}
              style={primaryButtonDisabled && styles.disabled}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>{primaryButtonText}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={[styles.button, styles.marginBottom20]}>
            <TouchableOpacity
              onPress={onPrimaryButtonPress}
              accessibilityRole="button"
              disabled={primaryButtonDisabled}
              style={primaryButtonDisabled && styles.disabled}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>{primaryButtonText}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onSecondaryButtonPress}>
            <View style={[styles.secondaryButton, styles.marginBottom40]}>
              <Text style={styles.textHighlight}>{secondaryButtonText}</Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imageBackground}
        resizeMode="cover"
        source={require('../assets/images/weather-background.png')}>
        <Image
          source={require('../assets/images/fmi-logo-fi.png')}
          resizeMode="center"
          style={styles.logo}
        />
      </ImageBackground>
      <View style={styles.innerContainer}>
        {pageIndex === 0 && (
          <PermissionComponent
            title={t('termsAndConditions')}
            description={t('termsAndConditionsDescription')}
            primaryButtonText={t('accept')}
            secondaryButtonText={t('termsAndConditions')}
            onPrimaryButtonPress={() => setPageIndex(1)}
            onSecondaryButtonPress={() => {
              if (!didViewTerms) setDidViewTerms(true);
              navigation.navigate('TermsAndConditions');
            }}
            primaryButtonDisabled={!didViewTerms}
          />
        )}
        {pageIndex === 1 && (
          <PermissionComponent
            title={t('location')}
            description={t('locationDescription')}
            primaryButtonText={t('acceptLocation')}
            secondaryButtonText={t('declineLocation')}
            onPrimaryButtonPress={requestLocationPermissions}
            onSecondaryButtonPress={setUpDone}
            primaryButtonDisabled={false}
            primaryButtonFirst
          />
        )}
      </View>
      <View style={[styles.row, styles.center, styles.height10]}>
        <View
          style={[
            styles.pagination,
            styles.marginRight,
            pageIndex === 0 ? styles.active : styles.inActive,
          ]}
        />
        <View
          style={[
            styles.pagination,
            pageIndex === 1 ? styles.active : styles.inActive,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_BLUE,
  },
  imageBackground: {
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    position: 'absolute',
    top: 100,
  },
  innerContainer: {
    position: 'absolute',
    bottom: 72,
    alignSelf: 'center',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 3,
    shadowColor: SHADOW_LIGHT,
  },
  permissionContainer: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: WHITE,
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: PRIMARY_BLUE,
    fontSize: 16,
    marginBottom: 20,
    marginTop: 30,
    alignSelf: 'center',
    fontFamily: 'Roboto-Bold',
  },
  textNormal: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Roboto-Regular',
  },
  textHighlight: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: PRIMARY_BLUE,
  },
  secondaryButton: {
    borderBottomWidth: 2,
    padding: 4,
    borderBottomColor: SECONDARY_BLUE,
  },
  button: {
    minWidth: 120,
    paddingHorizontal: 24,
    height: 44,
    borderRadius: 25,
    backgroundColor: PRIMARY_BLUE,
  },
  textContainer: {
    height: '100%',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: WHITE,
    textAlign: 'center',
  },
  pagination: {
    height: 10,
    width: 10,
    borderRadius: 50,
  },
  active: {
    backgroundColor: WHITE,
  },
  inActive: {
    backgroundColor: GRAY_1,
  },
  marginRight: {
    marginRight: 8,
  },
  height10: {
    height: 10,
  },
  row: {
    position: 'absolute',
    bottom: 32,
    width: '100%',
    flexDirection: 'row',
  },
  center: {
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  marginBottom20: {
    marginBottom: 20,
  },
  marginBottom40: {
    marginBottom: 40,
  },
});

export default SetupScreen;