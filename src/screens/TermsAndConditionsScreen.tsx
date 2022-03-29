import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';

import { CustomTheme, WHITE } from '@utils/colors';

type TermsAndConditionsScreenProps = {
  showCloseButton?: boolean;
  onClose?: () => void;
};

const TermsAndConditionsScreen: React.FC<TermsAndConditionsScreenProps> = ({
  showCloseButton,
  onClose,
}) => {
  const { t } = useTranslation('termsAndConditions');
  const { colors } = useTheme() as CustomTheme;
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.primaryText }]}>
          {t('generalTitle')}
        </Text>
        <Text style={[styles.body, { color: colors.hourListText }]}>
          {t('loremIpsum')}
        </Text>
        <Text style={[styles.title, { color: colors.primaryText }]}>
          {t('contentsTitle')}
        </Text>
        <Text style={[styles.body, { color: colors.hourListText }]}>
          {t('loremIpsum')}
        </Text>
        <Text style={[styles.title, { color: colors.primaryText }]}>
          {t('someOtherTitle')}
        </Text>
        <Text style={[styles.body, { color: colors.hourListText }]}>
          {t('loremIpsum')}
        </Text>
      </ScrollView>
      {showCloseButton && (
        <View
          style={[styles.closeButtonContainer, { shadowColor: colors.shadow }]}>
          <TouchableOpacity onPress={onClose}>
            <View style={[styles.closeButton, { borderColor: colors.text }]}>
              <Text style={[styles.closeText, { color: colors.text }]}>
                {t('close')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginTop: 32,
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  closeButtonContainer: {
    backgroundColor: WHITE,
    width: '100%',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 11,
    alignItems: 'center',
    paddingVertical: 16,
  },
  closeButton: {
    width: 120,
    height: 44,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});

export default TermsAndConditionsScreen;