import React, { useState, useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import { View, StyleSheet, ActivityIndicator, Dimensions, FlatList, Modal, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import * as Analytics from 'expo-firebase-analytics';
import { useScrollToTop } from '@react-navigation/native';
import { MaterialCommunityIcons, Entypo, MaterialIcons } from '@expo/vector-icons';
import UnclickableUserComponent from '../cells/FollowCellComps/unclickableUserComponent';
import FeedCellClass from '../cells/feedCellClass.js';
import Firebase from '../../firebase';

const ThoughtsFeed = (props) => {
  /**
     * Any refs that you have in the component will be instantiated as a constant at the top of the function with the `useRef()` hook (which you will import from react),
     * passing in the initialValue (if it's known on page load) as the param.
     */

  // Refs
  const scrollRef = useRef(null);
  useScrollToTop(scrollRef);

  // Props
  const { user, navigation, postsLoading } = props;
  const flagOptions = ['STOCKS', 'OPTIONS', 'CRYPTOS', 'MEMES', 'RESEARCH', 'NEWS', 'TIPS', 'QUESTIONS'];
  const categories = ['STOCKS', 'OPTIONS', 'CRYPTOS', 'MEMES', 'RESEARCH', 'NEWS', 'TIPS', 'QUESTIONS'];

  /**
     * The `useDispatch()` hook is given to us from react-redux and it allows us to make calls to our action creators
     */

  // Dispatch
  const dispatch = useDispatch();

  /**
     * We no longer need to use the `constructor` with `super(props)` or as a way to set the initial `this.state`. The `useState()` hook handles that, passing in
     * the initial state as the param
     */

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('STOCKS');
  const [image, setImage] = useState(null);
  const [link, setLink] = useState(null);
  const [text, setText] = useState('');
  const [thoughtsArray, setThoughtsArray] = useState([]);

  /**
     * The `useEffect()` hook with an empty array replaces your `componentDidMount`
     */

  // Effects
  useEffect(() => {
    // fetchCollection();
    Analytics.setCurrentScreen('ThoughtsFeed');
  }, []);

  /**
     * Anytime the postsLoading value changes, this useEffect will run
     */
  useEffect(() => {
    setIsLoading(postsLoading);
  }, [postsLoading]);


  // const refresh = () => {
  //   setIsLoading(true);
  //   fetchCollection();
  // };

  // const handleFetchMorePosts = () => {
  //   fetchMorePosts();
  // };

  //Check if the flag is null -> Alert
  //Check if the text is empty (remove all whitespace and check, otherwise we good) -> Alert
  //Check if there is an image
  //Check if there is a link
  //Send it via functions
  //Close the modal
  const handleSubmit = () => {
    console.log(`${selectedId} ${text.trim()} `);
    if (selectedId === null) {
      Alert.alert(
        'oops!',
        "category can't be blank",
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
    } else if (text.trim() === '') {
      Alert.alert(
        'pause',
        "post can't be blank",
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
    }
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const renderItem = ({ item }) => (

    <FeedCellClass
      username={item.username}
      description={item.description}
      image={item.image}
      security={item.security}
      ticker={item.ticker}
      percent_gain_loss={item.percent_gain_loss}
      profit_loss={item.profit_loss}
      gain_loss={item.gain_loss}
      postID={item.key}
      navigation={navigation}
      date_created={item.date_created.toDate()}
      uid={item.uid}
      viewsCount={item.viewsCount}
    />
  );

  //Image opens image picker, link opens a textbox to show the link?
  const renderModalMenu = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

      <View style={{ paddingLeft: 80, paddingTop: 10 }}>
        <Entypo name="image" size={50} color="#696969" />

      </View>


      <View style={styles.middleLineStyle} />

      <View style={{ paddingRight: 80, paddingTop: 10 }}>
        <Entypo name="link" size={50} color="#696969" />

      </View>


    </View>
  );

  const renderSendAndCancel = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 }}>

      <TouchableOpacity
        onPress={handleClose}
        style={{ paddingLeft: 70 }}
      >
        <MaterialIcons name="cancel" size={70} color="red" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSubmit}
        style={{ paddingRight: 70 }}
      >
        <MaterialCommunityIcons name="send-circle" size={70} color="#07dbd1" />
      </TouchableOpacity>


    </View>
  );

  const renderFlags = () => (
    <FlatList
      horizontal
      data={flagOptions}
      extraData={
        selectedId // for single item
      }
      style={styles.flatList}
      renderItem={({ item: rowData }) => (
        <TouchableOpacity
          onPress={() => setSelectedId(rowData)}
          style={rowData === selectedId ? styles.selected : styles.unselected}
        >
          <Text style={{ fontWeight: 'bold', color: '#FFFFFF', padding: 6 }}>
            { rowData }
          </Text>

        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => item.toString()}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalOpen}
        onRequestClose={() => {
          setModalOpen(!modalOpen);
        }}
      >

        <View style={{ backgroundColor: '#121212', flex: 1, paddingTop: 50 }}>

          <View style={{ paddingLeft: 5 }}>
            <UnclickableUserComponent uid={user.id} navigation={props.navigation} />
          </View>

          { renderFlags() }

          <View style={styles.lineStyle} />

          <TextInput
            style={{ backgroundColor: '#121212', height: 240, color: 'white', marginLeft: 12, marginRight: 12, marginTop: 10, marginBottom: 15 }}
            placeholder="what's on your mind?"
            placeholderTextColor="#696969"
            maxLength={480}
            value={text}
            onChangeText={text => setText(text)}
            multiline
          />


          <View style={styles.lineStyle} />
          {/* add image, Link, and flair*/}

          { renderModalMenu() }
          <View style={styles.lineStyle} />
          { renderSendAndCancel() }

          {/* <TouchableOpacity
            onPress={handleClose}
          >
            <MaterialCommunityIcons name="pencil-circle" size={70} color="#07dbd1" />
          </TouchableOpacity> */}
        </View>

      </Modal>
      <View style={{position: 'absolute', left: 0, top: 0}}>
        <FlatList
          horizontal
          data={flagOptions}
          extraData={
        selectedCategory // for single item
      }
          style={styles.flatList}
          renderItem={({ item: rowData }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(rowData)}
              style={rowData === selectedCategory ? styles.selected : styles.unselected}
            >
              <Text style={{ fontWeight: 'bold', color: '#FFFFFF', padding: 6 }}>
                { rowData }
              </Text>

            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => item.toString()}
        />
      </View>


      {/* <FlatList
        ref={scrollRef}
        data={globalPostsArray}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onRefresh={refresh}
        refreshing={isLoading}
        onEndReached={handleFetchMorePosts}
      /> */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleOpen}
      >
        <MaterialCommunityIcons name="pencil-circle" size={70} color="#07dbd1" />
      </TouchableOpacity>

      <KeyboardSpacer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    color: '#FFFFFF',
  },
  view: {
    backgroundColor: '#000000',
  },
  thumbnail: {
    width: 300,
    height: 300,
    paddingBottom: 20,
    resizeMode: 'contain',
  },

  inputBox: {
    width: '85%',
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: '#d3d3d3',
    borderBottomWidth: 1,
    textAlign: 'center',
  },
  nextButton: {
    marginTop: 30,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#5233FF',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    width: 200,
  },
  button: {
    marginTop: 30,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#5233FF',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    width: 200,
  },
  globalFeedCell: {
    marginTop: 10,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    width: Dimensions.get('window').width - 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerText: {
    fontSize: 30,
    alignItems: 'center',
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  subheaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    alignContent: 'center',
    paddingBottom: 10,
  },
  tradeText: {
    fontSize: 16,
    fontWeight: 'bold',
    alignContent: 'center',
    paddingBottom: 10,
    paddingTop: 20,
  },
  regularText: {
    fontSize: 16,
    alignContent: 'center',
    paddingBottom: 10,
  },
  textContainer: {
    alignContent: 'center',
    paddingBottom: 10,
    paddingTop: 20,
  },
  twoPickers: {
    width: 200,
    height: 88,
  },
  twoPickerItems: {
    height: 88,
  },
  createButton: {
    // width: 60,
    // height: 60,
    // borderRadius: 30,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },

  lineStyle: {
    borderWidth: 1,
    borderColor: '#696969',
    width: Dimensions.get('window').width,
    // marginBottom: 10,
  },
  mainMenu: {
    height: 50,
    backgroundColor: 'transparent',
    flexGrow: 0,
    position: 'absolute',
  },

  flatList: {
    height: 50,
    backgroundColor: 'transparent',
    flexGrow: 0,
  },

  middleLineStyle: {
    borderWidth: 1,
    borderColor: '#696969',
    height: 75,
  },
  selected: {
    backgroundColor: 'transparent',
    borderColor: '#696969',
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 12,
    marginLeft: 5,
    padding: 0,
  },
  unselected: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 12,
    marginLeft: 5,
    padding: 0,
  },
});

const mapStateToProps  = (state) => {
  const { PostsReducer, UserReducer } = state;
  return {
    user: UserReducer.user,
    globalPosts: PostsReducer.globalPosts,
    postsLoading: PostsReducer.postsLoading,
  };
};

export default connect(mapStateToProps)(ThoughtsFeed);
