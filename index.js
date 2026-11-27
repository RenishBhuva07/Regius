/**
 * @format
 */

import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import { name as appName } from './app.json';
import { playbackService } from './src/Services/playbackService';
import { ReminderNotificationService } from './src/Services/Reminders/ReminderNotificationService';

ReminderNotificationService.registerBackgroundHandler();

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => playbackService);

