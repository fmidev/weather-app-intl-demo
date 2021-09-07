import {
  PRIMARY_BLUE,
  SECONDARY_BLUE,
  GRAYISH_BLUE,
  LIGHT_BLUE,
  WHITE,
  GRAY_7,
  GRAY_6,
  GRAY_5,
  GRAY_4,
  GRAY_3,
  GRAY_1,
  BLACK,
} from '../utils/colors';

export const lightTheme = {
  dark: false,
  colors: {
    primary: SECONDARY_BLUE,
    background: WHITE,
    card: WHITE,
    text: PRIMARY_BLUE,
    notification: WHITE,
    primaryText: PRIMARY_BLUE,
    secondaryText: GRAY_3,
    border: GRAYISH_BLUE,
    inputBackground: LIGHT_BLUE,
    inputButtonBackground: WHITE,
    mapButtonBackground: WHITE,
    mapButtonBorder: GRAYISH_BLUE,
    headerBackground: WHITE,
    timeStepBackground: LIGHT_BLUE,
    shadow: BLACK,
    screenBackground: GRAYISH_BLUE,
    cardHeader: PRIMARY_BLUE,
    cardShadow: GRAYISH_BLUE,
    warningsIconFill: PRIMARY_BLUE,
    selectedDayBackground: PRIMARY_BLUE,
    chartSecondaryLine: SECONDARY_BLUE,
  },
};

export const darkTheme = {
  dark: true,
  colors: {
    primary: WHITE,
    background: GRAY_6,
    card: GRAY_7,
    text: WHITE,
    notification: WHITE,
    primaryText: WHITE,
    secondaryText: GRAY_1,
    border: GRAY_3,
    inputBackground: GRAY_4,
    inputButtonBackground: GRAY_5,
    mapButtonBackground: GRAY_6,
    mapButtonBorder: GRAY_7,
    headerBackground: GRAY_6,
    timeStepBackground: GRAY_6,
    shadow: WHITE,
    screenBackground: GRAY_7,
    cardHeader: GRAY_3,
    cardShadow: BLACK,
    warningsIconFill: BLACK,
    selectedDayBackground: GRAY_4,
    chartSecondaryLine: GRAYISH_BLUE, // TODO: needs design
  },
};
