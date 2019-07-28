import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import RecordingScreen from "./screens/RecordingScreen/RecordingScreen";

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Home Screen`
      })
    },
    Record: {
      screen: RecordingScreen,

      navigationOptions: ({ navigation }) => ({})
    }
  },
  {
    headerMode: "none"
  }
);

export default createAppContainer(AppNavigator);
