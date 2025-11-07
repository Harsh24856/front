// Register the root component with the name "main"
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
// This tells React Native: AppRegistry.registerComponent('main', () => App)