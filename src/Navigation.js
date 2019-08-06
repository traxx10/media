import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import RecordingScreen from "./screens/RecordingScreen/RecordingScreen";
import RecordedScreen from "./screens/RecordedScreen/RecordedScreen";

// const AppNavigator = createStackNavigator(
//   {
//     Home: {
//       screen: HomeScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Home Screen`
//       })
//     },
//     Record: {
//       screen: RecordingScreen,

//       navigationOptions: ({ navigation }) => ({})
//     },
// Recorded: {
//   screen: RecordedScreen;
// }
//   },
//   {
//     headerMode: "none"
//   }
// );

const AppNavigator = createStackNavigator(
  {
    // Home: {
    //   screen: HomeScreen,
    //   navigationOptions: ({ navigation }) => ({
    //     title: `Home Screen`
    //   })
    // },
    Record: {
      screen: RecordingScreen,

      navigationOptions: ({ navigation }) => ({})
    },
    Recorded: {
      screen: RecordedScreen
    }
  },
  {
    headerMode: "none"
  }
);

export default createAppContainer(AppNavigator);
