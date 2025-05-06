import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // Get screen width and height

export const colors = {
  primary: '#4361ee',
  secondary: '#3f37c9',
  accent: '#4895ef',
  light: '#f1faee',
  white: '#ffffff',
  dark: '#1d3557',
  error: '#e63946',
  success: '#2a9d8f',
  warning: '#ffb703',
  darkBg: '#293241',
  lightBg: '#f8f9fa',
  gray: '#adb5bd',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
    paddingTop: height * 0.02, // dynamic padding based on screen height
    padding: width * 0.05, // dynamic padding based on screen width
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightBg,
    padding: width * 0.05, // dynamic padding
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: width * 0.05, // dynamic padding
    marginVertical: height * 0.02, // dynamic margin
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: width * 0.06, // dynamic font size based on screen width
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: height * 0.03, // dynamic margin
  },
  subtitle: {
    fontSize: width * 0.05, // dynamic font size
    fontWeight: '600',
    color: colors.dark,
    marginBottom: height * 0.02, // dynamic margin
  },
  text: {
    fontSize: width * 0.045, // dynamic font size
    color: colors.dark,
    marginBottom: height * 0.015, // dynamic margin
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    padding: width * 0.04, // dynamic padding
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: height * 0.015, // dynamic margin
  },
  buttonSecondary: {
    backgroundColor: colors.accent,
    padding: width * 0.04, // dynamic padding
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: height * 0.015, // dynamic margin
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: width * 0.04, // dynamic font size
  },
  input: {
    backgroundColor: colors.white,
    padding: width * 0.04, // dynamic padding
    borderRadius: 10,
    marginVertical: height * 0.015, // dynamic margin
    borderWidth: 1,
    borderColor: colors.gray,
  },
  logo: {
    width: width * 0.4, // dynamic width based on screen size
    height: height * 0.2, // dynamic height based on screen size
    resizeMode: 'contain',
    marginBottom: height * 0.05, // dynamic margin
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.01, // dynamic margin
  },
  badge: {
    backgroundColor: colors.accent,
    paddingVertical: height * 0.01, // dynamic padding
    paddingHorizontal: width * 0.03, // dynamic padding
    borderRadius: 20,
    marginRight: width * 0.03, // dynamic margin
  },
  badgeText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: width * 0.03, // dynamic font size
  },
});
