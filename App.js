// import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Container, Button, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StatusBar } from 'expo-status-bar';

import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import firebase from './firebase.js';
import  rootReducer  from './redux/rootReducer';

//Auth Imports
import Login from './screens/auth/Login.js';
import Signup from './screens/auth/Signup.js';
import Signup2 from './screens/auth/Signup2.js';
import ForgotPassword from './screens/auth/ForgotPassword.js';

//Tab Screen Imports
import Profile from './screens/profile/Profile.js';
import FriendsScreen from './screens/home/FriendsScreen.js';
import GlobalScreen from './screens/home/GlobalScreen.js';
import LeaderboardGains from './screens/leaderboard/leaderboardGains';
import LeaderboardLosses from './screens/leaderboard/leaderboardLosses';
import Chat from './screens/chat/chat';
import ThoughtsFeed from './screens/thoughts/thoughts';
import ChatRooms from './screens/chat/chatRooms';
import SingleStockChat from './screens/chat/singleStockChat';
import SingleStockPosts from './screens/misc/singleStockPosts';

//Create a post flow
import Create from './screens/create/Create.js';
import GainScreenshot from './screens/create/createGain/gainScreenshot';
import GainTrade from './screens/create/createGain/gainTradeInfo';
import GainTradeNumbers from './screens/create/createGain/gainTradeNumbers';
import GainTradeConfirm from './screens/create/createGain/gainTradeConfirm';
import LossScreenshot from './screens/create/createLoss/lossScreenshot';
import LossTrade from './screens/create/createLoss/lossTradeInfo';
import LossTradeNumbers from './screens/create/createLoss/lossTradeNumbers';
import LossTradeConfirm from './screens/create/createLoss/lossTradeConfirm';
import YoloScreenshot from './screens/create/createTrade/yoloScreenshot';
import YoloTrade from './screens/create/createTrade/yoloInfo';
import YoloNumbers from './screens/create/createTrade/yoloNumbers';
import YoloConfirm from './screens/create/createTrade/yoloConfirm';

//Onboarding Flow
import OnboardingScreen1 from './screens/onboarding/OnboardingScreen1';
import OnboardingScreen2 from './screens/onboarding/OnboardingScreen2';
import OnboardingScreen3 from './screens/onboarding/OnboardingScreen3';
import OnboardingScreen4 from './screens/onboarding/OnboardingScreen4';

//Cells
import FeedCellClass from './screens/cells/feedCellClass.js';
import CommentCellClass from './screens/cells/commentCellClass';

//Other pages
import Settings from './screens/settings/settings.js';
import EditProfile from './screens/settings/editProfile';
import Search from './screens/search/search';
import Notification from './screens/notifications/Notifications.js';
import ClickedPostPage from './screens/misc/clickedPostPage';
import SpecialClickedPostPage from './screens/misc/specialClickedPostPage';
import ClickedUserProfile from './screens/misc/clickedUserProfile';
import ClickedFollowPage from './screens/misc/clickedFollowPage';
import ThoughtsDetails from './screens/misc/thoughtsDetails';
import ThoughtsComments from './screens/misc/thoughtsComments';

const createStoreWithMiddleware = compose(applyMiddleware(reduxThunk)(createStore));
const store = createStoreWithMiddleware(rootReducer);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const CreateStack = createStackNavigator();
const OnboardingStack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();


const ChatStack = createStackNavigator();


const LBTopTab = createMaterialTopTabNavigator();
const ChatTopTabs = createMaterialTopTabNavigator();


const LeaderboardGainsStack = createStackNavigator();
const LeaderboardLossesStack = createStackNavigator();


const SingleStockChatStack = createStackNavigator();
const SingleStockPostStack = createStackNavigator();

const GlobalFeedStack = createStackNavigator();
const FriendFeedStack = createStackNavigator();

/**
 * I dont want to doink your existing redux store before you refactor the other reducers, but once you do you will remove the { store } import
 * at the top of this file and replace it with this:
 *
 *
 */

const App = () => (
  <Provider store={store}>
    <StatusBar style="light" />
    <NavigationContainer>

      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: null,
            headerLeft: null,
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#000000',
              shadowColor: 'transparent',
            },
          }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            title: null,
            headerLeft: null,
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#000000',
              shadowColor: 'transparent',
            },
          }}
        />
        <Stack.Screen
          name="Signup2"
          component={Signup2}
          options={{
            title: null,
            headerLeft: null,
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#000000',
              shadowColor: 'transparent',
            },
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            // headerLeft: null,
            title: ' ',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 25,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#121212',
              shadowColor: 'transparent',
            },
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            title: 'settings',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 25,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#121212',
              shadowColor: 'transparent',
            },
            headerBackTitle: '',
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            title: 'edit profile',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 25,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#121212',
              shadowColor: 'transparent',
            },
            headerBackTitle: '',
          }}
        />
        {/* <Stack.Screen
          name="Leaderboard"
          component={LBTopTabs}
          options={{
            title: 'leaderboard',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 25,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#000000',
              shadowColor: 'transparent',
            },
            headerBackTitle: '',
          }}
        /> */}
        <Stack.Screen
          name="SingleStockPosts"
          component={SingleStockPosts}
          options={({ route }) => ({
            title: `$${route.params.ticker}`,
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 25,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#000000',
              shadowColor: 'transparent',
            },
            headerBackTitle: '',
          })}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{
            title: 'search',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 25,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#121212',
              shadowColor: 'transparent',
            },
            headerBackTitle: '',
          }}
        />
        <Stack.Screen
          name="Create"
          component={createFlowStack}
          options={{
            title: null,
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 25,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#121212',
              shadowColor: 'transparent',
            },
            headerBackTitle: '',
          }}
        />
        <Stack.Screen
          name="ChatRooms"
          component={chatRoomsStackView}
          options={{
            title: 'chat',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 25,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#121212',
              shadowColor: 'transparent',
            },
            headerBackTitle: '',
          }}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={({ route }) => ({
            title: route.params.roomName, //Will be nice to add the name of the room eg stock, options, crypto, etc
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#121212',
              shadowColor: 'transparent',
            },
            headerBackTitle: '',
          })}
        />
        <Stack.Screen
          name="Cell"
          component={FeedCellClass}
          options={{
            headerLeft: null,
          }}
        />
        <Stack.Screen
          name="CommentCell"
          component={CommentCellClass}
          options={{
            headerLeft: null,
          }}
        />
        <Stack.Screen
          name="ClickedPostPage"
          component={ClickedPostPage}
          options={{
            title: 'comments',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#121212',
              shadowColor: 'transparent',
            },
            headerBackTitle: '',
          }}
        />
        <Stack.Screen
          name="SpecialClickedPostPage"
          component={SpecialClickedPostPage}
          options={{
            title: 'post details',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#121212',
              shadowColor: 'transparent',
            },
            headerBackTitle: '',
          }}
        />
        <Stack.Screen
          name="ThoughtsDetails"
          component={ThoughtsDetails}
          options={{
            title: 'thought details',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#121212',
              shadowColor: 'transparent',
            },
            headerBackTitle: '',
          }}
        />
        <Stack.Screen
          name="Onboarding"
          component={createOnboardingStack}
          options={{
            title: null,
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#000000',
              shadowColor: 'transparent',
            },
            headerTitle: null,
            headerLeft: null,
          }}
        />
        <Stack.Screen
          name="ThoughtsComments"
          component={ThoughtsComments}
          options={{
            title: 'comments',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#121212',
              shadowColor: 'transparent',
            },
            headerBackTitle: '',
          }}
        />
        <Stack.Screen
          name="ClickedUserProfile"
          component={ClickedUserProfile}
          options={{
            title: 'profile details',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#121212',
              shadowColor: 'transparent',
            },
            headerTitle: null,
            headerBackTitle: '',
          }}
        />
        <Stack.Screen
          name="ClickedFollowPage"
          component={ClickedFollowPage}
          options={{
            title: ' ',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
              color: '#FFFFFF',
            },
            headerStyle: {
              backgroundColor: '#121212',
              shadowColor: 'transparent',
            },
            headerTitle: null,
            headerBackTitle: '',
          }}
        />
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={({ navigation }) => ({
            title: ' ',
            // headerTitleStyle: {
            //   fontWeight: 'bold',
            //   fontSize: 24,
            //   color: '#FFFFFF',
            // },
            headerStyle: {
              backgroundColor: '#000000',
              shadowColor: 'transparent',
            },
            headerLeft: () => (
              <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#FFFFFF' }}>trade</Text>
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#07dbd1' }}>rank</Text>
              </View>
            ),
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>

                {/* <TouchableOpacity
                  style={{ paddingRight: 20 }}
                  onPress={() => navigation.navigate('ChatRooms')}
                >
                  <Ionicons name="md-chatbubbles" size={25} color="white" />
                </TouchableOpacity> */}

                <TouchableOpacity
                  style={{ paddingRight: 20 }}
                  onPress={() => navigation.navigate('Search')}
                >
                  <Ionicons name="ios-search" size={25} color="white" />
                </TouchableOpacity>

              </View>

            ),

          })}
        />
      </Stack.Navigator>

    </NavigationContainer>
  </Provider>
);

function renderBadge() {
  const [badge, setBadge] = useState(null);

  firebase.firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .onSnapshot((doc) => {
      if (doc.data().hasNotifications) {
        setBadge(true);
      } else {
        setBadge(null);
      }
    });

  return badge;
}

function renderChatBadge() {
  const [badge, setBadge] = useState(null);

  firebase.firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .onSnapshot((doc) => {
      if (doc.data().hasChatNotifications) {
        setBadge(true);
      } else {
        setBadge(null);
      }
    });

  return badge;
}


//Bottom Tabs
function Tabs() {
  return (

    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#696969',
        style: {
          backgroundColor: '#000000',
          borderTopColor: 'transparent',
        },
      }}
    >

      <Tab.Screen
        name="Home"
        component={GlobalScreen}
        options={{
          tabBarLabel: ' ',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="piggy-bank" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Thoughts"
        component={ThoughtsFeed}
        options={{
          tabBarLabel: ' ',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="comment-dollar" size={size} color={color} />
          ),
          // tabBarBadge: renderChatBadge(),


        }}
      />

      <Tab.Screen
        name="Leaderboard"
        component={LBTopTabs}
        options={{
          tabBarLabel: ' ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-trophy" size={size} color={color} />
          ),
        }}

      />

      <Tab.Screen
        name="Notificaton"
        component={Notification}
        options={{
          tabBarLabel: ' ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-notifications" size={size} color={color} />
          ),
          tabBarBadge: renderBadge(),

        }}
      />


      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: ' ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-person" size={size} color={color} />
          ),
        }}
      />

    </Tab.Navigator>
  );
}

//Create flow stack
function createFlowStack() {
  return (
    <CreateStack.Navigator
      initialRouteName="Create"
    >

      <CreateStack.Screen
        name="Create"
        component={Create}
        options={{
          headerShown: false,
        }}
      />

      <CreateStack.Screen
        name="GainScreenshot"
        component={GainScreenshot}
        options={({ navigation }) => ({
          headerRight: () => (
            <Button
              onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: 'Create' }],
              })}
              title="Cancel"
              color="red"
            />
          ),
          headerBackTitle: '',
          headerStyle: {
            backgroundColor: '#000000',
            shadowColor: 'transparent',
          },
          headerTitle: '',

        })}
      />

      <CreateStack.Screen
        name="GainTrade"
        component={GainTrade}
        options={({ navigation }) => ({
          headerRight: () => (
            <Button
              onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: 'Create' }],
              })}
              title="Cancel"
              color="red"
            />
          ),
          headerBackTitle: '',
          headerStyle: {
            backgroundColor: '#000000',
            shadowColor: 'transparent',
          },
          headerTitle: '',

        })}
      />

      <CreateStack.Screen
        name="GainTradeNumbers"
        component={GainTradeNumbers}
        options={({ navigation }) => ({
          headerRight: () => (
            <Button
              onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: 'Create' }],
              })}
              title="Cancel"
              color="red"
            />
          ),
          headerBackTitle: '',
          headerStyle: {
            backgroundColor: '#000000',
            shadowColor: 'transparent',
          },
          headerTitle: '',

        })}
      />

      <CreateStack.Screen
        name="GainTradeConfirm"
        component={GainTradeConfirm}
        options={({ navigation }) => ({
          headerLeft: null,
          headerStyle: {
            backgroundColor: '#000000',
            shadowColor: 'transparent',
          },
          headerTitle: '',

        })}
      />

      <CreateStack.Screen
        name="LossScreenshot"
        component={LossScreenshot}
        options={({ navigation }) => ({
          headerRight: () => (
            <Button
              onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: 'Create' }],
              })}
              title="Cancel"
              color="red"
            />
          ),
          headerBackTitle: '',
          headerStyle: {
            backgroundColor: '#000000',
            shadowColor: 'transparent',
          },
          headerTitle: '',

        })}
      />

      <CreateStack.Screen
        name="LossTrade"
        component={LossTrade}
        options={({ navigation }) => ({
          headerRight: () => (
            <Button
              onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: 'Create' }],
              })}
              title="Cancel"
              color="red"
            />
          ),
          headerBackTitle: '',
          headerStyle: {
            backgroundColor: '#000000',
            shadowColor: 'transparent',
          },
          headerTitle: '',

        })}
      />

      <CreateStack.Screen
        name="LossTradeNumbers"
        component={LossTradeNumbers}
        options={({ navigation }) => ({
          headerRight: () => (
            <Button
              onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: 'Create' }],
              })}
              title="Cancel"
              color="red"
            />
          ),
          headerBackTitle: '',
          headerStyle: {
            backgroundColor: '#000000',
            shadowColor: 'transparent',
          },
          headerTitle: '',

        })}
      />

      <CreateStack.Screen
        name="LossTradeConfirm"
        component={LossTradeConfirm}
        options={({ navigation }) => ({
          headerLeft: null,
          headerStyle: {
            backgroundColor: '#000000',
            shadowColor: 'transparent',
          },
          headerTitle: '',

        })}
      />
      <CreateStack.Screen
        name="YoloScreenshot"
        component={YoloScreenshot}
        options={({ navigation }) => ({
          headerRight: () => (
            <Button
              onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: 'Create' }],
              })}
              title="Cancel"
              color="red"
            />
          ),
          headerBackTitle: '',
          headerStyle: {
            backgroundColor: '#000000',
            shadowColor: 'transparent',
          },
          headerTitle: '',

        })}
      />

      <CreateStack.Screen
        name="YoloTrade"
        component={YoloTrade}
        options={({ navigation }) => ({
          headerRight: () => (
            <Button
              onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: 'Create' }],
              })}
              title="Cancel"
              color="red"
            />
          ),
          headerBackTitle: '',
          headerStyle: {
            backgroundColor: '#000000',
            shadowColor: 'transparent',
          },
          headerTitle: '',

        })}
      />

      <CreateStack.Screen
        name="YoloNumbers"
        component={YoloNumbers}
        options={({ navigation }) => ({
          headerRight: () => (
            <Button
              onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: 'Create' }],
              })}
              title="Cancel"
              color="red"
            />
          ),
          headerBackTitle: '',
          headerStyle: {
            backgroundColor: '#000000',
            shadowColor: 'transparent',
          },
          headerTitle: '',

        })}
      />

      <CreateStack.Screen
        name="YoloConfirm"
        component={YoloConfirm}
        options={({ navigation }) => ({
          headerLeft: null,
          headerStyle: {
            backgroundColor: '#000000',
            shadowColor: 'transparent',
          },
          headerTitle: '',

        })}
      />

    </CreateStack.Navigator>
  );
}

//Create flow stack
function createOnboardingStack() {
  return (
    <OnboardingStack.Navigator
      initialRouteName="OnboardingScreen1"
    >

      <OnboardingStack.Screen
        name="OnboardingScreen1"
        component={OnboardingScreen1}
        options={{
          headerShown: false,
          headerLeft: null,
        }}
      />

      <OnboardingStack.Screen
        name="OnboardingScreen2"
        component={OnboardingScreen2}
        options={{
          headerShown: false,
        }}
      />

      <OnboardingStack.Screen
        name="OnboardingScreen3"
        component={OnboardingScreen3}
        options={{
          headerShown: false,
        }}
      />

      <OnboardingStack.Screen
        name="OnboardingScreen4"
        component={OnboardingScreen4}
        options={{
          headerShown: false,
        }}
      />


    </OnboardingStack.Navigator>
  );
}

//Home top tabs
function HomeTopTabs() {
  return (
    <View style={{ flex: 1 }}>
      <TopTab.Navigator
        initialRouteName="GlobalScreen"
        tabBarOptions={{
          activeTintColor: '#FFFFFF',
          inactiveTintColor: '#696969',
          style: {
            backgroundColor: '#000000',
          },
        }}
      >

        <TopTab.Screen
          name="GlobalScreen"
          component={globalFeedStackView}
          options={{
            tabBarLabel: 'GLOBAL 🌍',
          }}
        />

        <TopTab.Screen
          name="FriendScreen"
          component={friendFeedStackView}
          options={{
            tabBarLabel: 'FOLLOWING 👥',
          }}
        />

      </TopTab.Navigator>
    </View>

  );
}

//Home top tabs
function LBTopTabs() {
  return (
    <View style={{ flex: 1 }}>
      <LBTopTab.Navigator
        initialRouteName="LBGains"
        tabBarOptions={{
          activeTintColor: '#FFFFFF',
          inactiveTintColor: '#696969',
          style: {
            backgroundColor: '#000000',

          },
        }}
      >

        <LBTopTab.Screen
          name="LBGains"
          component={leaderboardGainStackView}
          options={{
            tabBarLabel: 'GAINS 📈',
          }}
        />

        <LBTopTab.Screen
          name="LBLosses"
          component={leaderboardLossStackView}
          options={{
            tabBarLabel: 'LOSSES 📉',
          }}
        />

      </LBTopTab.Navigator>
    </View>

  );
}

//Home top tabs
function SingleStockTabs() {
  return (
    <View style={{ flex: 1 }}>
      <ChatTopTabs.Navigator
        initialRouteName="SingleStockPost"
        tabBarOptions={{
          activeTintColor: '#FFFFFF',
          inactiveTintColor: '#696969',
          style: {
            backgroundColor: '#000000',

          },
        }}
      >

        {/* <ChatTopTabs.Screen
          name="SingleStockChat"
          component={singleStockChatStack}
          options={{
            tabBarLabel: 'chat',
          }}
        /> */}

        <ChatTopTabs.Screen
          name="SingleStockPost"
          component={singleStockPostStack}
          options={{
            tabBarLabel: 'posts',
          }}
        />

      </ChatTopTabs.Navigator>
    </View>

  );
}

//Global feed stack
function singleStockChatStack() {
  return (
    <SingleStockChatStack.Navigator initialRouteName="SingleStockChat">
      <SingleStockChatStack.Screen
        name="SingleStockChat"
        component={SingleStockChat}
        options={{
          headerShown: false,
        }}
      />
    </SingleStockChatStack.Navigator>

  );
}

//Global feed stack
function singleStockPostStack() {
  return (
    <SingleStockPostStack.Navigator initialRouteName="SingleStockPost">
      <SingleStockPostStack.Screen
        name="SingleStockPost"
        component={SingleStockPosts}
        options={{
          headerShown: false,
        }}
      />
    </SingleStockPostStack.Navigator>

  );
}


//Global feed stack
function globalFeedStackView() {
  return (
    <GlobalFeedStack.Navigator initialRouteName="GlobalFeed">
      <GlobalFeedStack.Screen
        name="GlobalFeed"
        component={GlobalScreen}
        options={{
          headerShown: false,
        }}
      />
    </GlobalFeedStack.Navigator>

  );
}

function chatRoomsStackView() {
  return (
    <ChatStack.Navigator initialRouteName="ChatRooms">
      <ChatStack.Screen
        name="ChatRooms"
        component={ChatRooms}
        options={({ navigation }) => ({
          // headerRight: () => (
          //   <View style={{ flexDirection: 'row' }}>

          //     <TouchableOpacity
          //       style={{ paddingRight: 20 }}
          //     >
          //       <MaterialIcons name="add-box" size={24} color="white" />
          //     </TouchableOpacity>

          //   </View>

          // ),
          title: ' ',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24,
            color: '#FFFFFF',
          },
          headerStyle: {
            backgroundColor: '#000000',
            shadowColor: 'transparent',
          },
          headerLeft: null,

        })}
      />

    </ChatStack.Navigator>

  );
}

//Friend feed stack
function friendFeedStackView() {
  return (
    <FriendFeedStack.Navigator initialRouteName="FriendFeed">
      <FriendFeedStack.Screen
        name="FriendFeed"
        component={FriendsScreen}
        options={{
          headerShown: false,
        }}
      />
    </FriendFeedStack.Navigator>

  );
}

//Global feed stack
function leaderboardGainStackView() {
  return (
    <LeaderboardGainsStack.Navigator initialRouteName="LBGains">
      <LeaderboardGainsStack.Screen
        name="LBGains"
        component={LeaderboardGains}
        options={{
          headerShown: false,
        }}
      />
    </LeaderboardGainsStack.Navigator>

  );
}

//Friend feed stack
function leaderboardLossStackView() {
  return (
    <LeaderboardLossesStack.Navigator initialRouteName="LBLosses">
      <LeaderboardLossesStack.Screen
        name="LBLosses"
        component={LeaderboardLosses}
        options={{
          headerShown: false,
        }}
      />
    </LeaderboardLossesStack.Navigator>

  );
}

export default App;
