module.exports = {
  preset: '@react-native/jest-preset',
  testPathIgnorePatterns: ['/node_modules/', '/__mocks__/'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-async-storage|react-native-responsive-fontsize|react-native-iphone-x-helper|react-native-toast-message)/)',
  ],
  moduleNameMapper: {
    '^lucide-react-native$':
      '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js',
    '^@react-native-community/datetimepicker$':
      '<rootDir>/__tests__/__mocks__/dateTimePickerMock.js',
    '\\.(wav|mp3|png|jpg|jpeg|gif)$':
      '<rootDir>/__tests__/__mocks__/fileMock.js',
  },
};
