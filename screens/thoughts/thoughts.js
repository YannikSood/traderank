import React, { useState, useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import { View, StyleSheet, ActivityIndicator, Dimensions, FlatList, Modal, Text, TouchableOpacity, TextInput, Alert, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import * as Analytics from 'expo-firebase-analytics';
import { useScrollToTop } from '@react-navigation/native';
import { MaterialCommunityIcons, Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import UnclickableUserComponent from '../cells/FollowCellComps/unclickableUserComponent';
import ThoughtsCell from '../cells/thoughtsCell';
import Firebase from '../../firebase';
import CachedImage from '../image/CachedImage';

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
  const flagOptions = ['STOCKS', 'OPTIONS', 'CRYPTOS', 'MEMES', 'NEWS', 'TIPS', 'QUESTIONS'];
  const categories = ['STOCKS', 'OPTIONS', 'CRYPTOS', 'MEMES', 'NEWS', 'TIPS', 'QUESTIONS'];

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
  const [image, setImage] = useState('');
  const [hasImage, setHasImage] = useState(false);
  const [hasLink, setHasLink] = useState(false);
  const [addedLink, setAddedLink] = useState('');
  const [text, setText] = useState('');
  const [thoughts, setThoughts] = useState([]);
  const [mediaType, setMediaType] = useState('');
  // const [thoughtsArray, setThoughtsArray] = useState([]);

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
    getCollection();
    setIsLoading(postsLoading);
  }, [postsLoading]);

  useEffect(() => {
    getCollection();
  }, [selectedCategory]);

  const refresh = () => {
    getCollection();
  };

  // const handleFetchMorePosts = () => {
  //   getMore();
  // };

  const recalculateCategory = (rowData) => {
    setSelectedCategory(rowData);
  };

  const clearAfterPost = () => {
    setSelectedId(null);
    setImage('');
    setHasImage(false);
    setHasLink(false);
    setAddedLink('');
    setText('');
  };

  const getCollection = async() => {
    setIsLoading(true);
    const index = 1;
    const getThoughtsOneCategory = Firebase.functions().httpsCallable('getThoughtsOneCategory');
    await getThoughtsOneCategory({
      index,
      category: selectedCategory,
    }).then((result) => {
      setThoughts(result.data);
      setIsLoading(false);
    }).catch((err) => {
      console.log(err);
    });
  };

  // const getMore = async() => {
  //   setIsLoading(true);
  //   const lastItemIndex = thoughts.length - 1;
  //   const getMoreThoughtsOneCategory = Firebase.functions().httpsCallable('getMoreThoughtsOneCategory');
  //   getMoreThoughtsOneCategory({
  //     index: lastItemIndex,
  //     category: selectedCategory,
  //     lastThought: thoughts[lastItemIndex],
  //   }).then((result) => {
  //     setThoughts(thoughts.concat(result.data));
  //     setIsLoading(false);
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // };

  //This uses minimal frontend server calls
  //Uploads picture to storage so I didn't have to learn a new lib. Tired af.
  //TODO: Move pic upload to the backend
  const handleSubmit = async() => {
    console.log(`${selectedId} ${text.trim()} `);
    if (selectedId === null) {
      Alert.alert(
        'wait',
        'pick a category',
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
    if (text.trim() !== '' && selectedId !== null) {
      setIsLoading(true);
      //Send this stuff serverside
      const postNewThought = Firebase.functions().httpsCallable('postNewThought');

      if (image !== '') {
        await Firebase.firestore()
          .collection('thoughts')
          .add({
            uid: user.id,
          })
          .then(async(docRef) => {
            const response = await fetch(image);
            const file = await response.blob();
            await Firebase
              .storage()
              .ref(`screenshots/${user.id}/${docRef.id}`)
              .put(file);

            const url = await Firebase.storage().ref(`screenshots/${user.id}/${docRef.id}`).getDownloadURL();

            postNewThought({
              userUID: user.id,
              username: user.username,
              description: text,
              category: selectedId,
              image: url,
              link: addedLink,
              date_created: new Date(),
              docRefID: docRef.id,
              mediaType,
            })
              .then((result) => {
                setIsLoading(false);
                setModalOpen(false);
                clearAfterPost();
                Analytics.logEvent('Thought_Posted');
                Analytics.logEvent(`Thought_Category_${selectedId}`);
              })
              .catch((err) => {
                console.log('Error from posting thought');
              });
          });
      } else {
        postNewThought({
          userUID: user.id,
          username: user.username,
          description: text,
          category: selectedId,
          image,
          link: addedLink,
          date_created: new Date(),
        })
          .then((result) => {
            setIsLoading(false);
            setModalOpen(false);
            Analytics.logEvent('Thought_Posted');
            Analytics.logEvent(`Thought_Category_${selectedId}`);
          })
          .catch((err) => {
            console.log('Error from posting thought');
          });
      }
    }
  };

  const openImagePickerAsync = async() => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      setImage(null);
      setHasImage(false);
      alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
    });

    try {
      if (pickerResult.cancelled === true) {
        setHasImage(false);
        console.log('pickerResult is cancelled');
        return;
      }

      if (pickerResult !== null) {
        setHasImage(true);
        setImage(pickerResult.uri);
        setMediaType(pickerResult.type);
        console.log(image);
        console.log(pickerResult.type);
      } else {
        setImage(null);
        setHasImage(false);
        console.log('pickerResult is null');
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const renderItem = ({ item }) => (

    <ThoughtsCell
      username={item.username}
      description={item.description}
      image={item.image}
      postID={item.key}
      navigation={navigation}
      date_created={item.date_created}
      uid={item.uid}
      viewsCount={item.viewsCount}
      link={item.link}
      mediaType={item.mediaType}
    />
  );

  const renderThumbnailForImageOrVideo = () => (
    <View>
      
      { mediaType === 'image' ? 
      <CachedImage 
        source={{ uri: `${this.state.image}` }}
        cacheKey={`${this.state.image}t`}
        backgroundColor="transparent"
        style={styles.thumbnail2}
      /> : 
      <AntDesign name="checkcircle" size={50} color="white" /> }
    </View>
  );

  //Image opens image picker, link opens a textbox to show the link?
  const renderModalMenu = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

      <TouchableOpacity
        onPress={openImagePickerAsync}
        style={{ marginLeft: Dimensions.get('window').width / 5, paddingTop: 10 }}
      >
        {hasImage
          ? renderThumbnailForImageOrVideo() : <Entypo name="image" size={50} color="#696969" /> }

      </TouchableOpacity>


      <View style={styles.middleLineStyle} />

      {hasLink
        ? (
          <TouchableOpacity
            onPress={() => setHasLink(false)}
            style={{ marginRight: Dimensions.get('window').width / 5, paddingTop: 10 }}
          >
            <Entypo name="link" size={50} color="#696969" />

          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setHasLink(true)}
            style={{ marginRight: Dimensions.get('window').width / 5, paddingTop: 10 }}
          >
            <Entypo name="link" size={50} color="#696969" />

          </TouchableOpacity>
        )}


    </View>
  );


  const renderSendAndCancel = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 }}>

      <TouchableOpacity
        onPress={handleClose}
        style={{ paddingLeft: Dimensions.get('window').width / 5.75 }}
      >
        <MaterialIcons name="cancel" size={70} color="red" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSubmit}
        style={{ paddingRight: Dimensions.get('window').width / 5.75 }}
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
      style={styles.flatListModal}
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

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ backgroundColor: '#121212', flex: 1, paddingTop: 50 }}>

          <View style={{ paddingLeft: 5 }}>
            <UnclickableUserComponent uid={user.id} navigation={props.navigation} />
          </View>

          { renderFlags() }

          <View style={styles.lineStyle} />

          <TextInput
            style={{ backgroundColor: '#121212', height: 180, color: 'white', marginLeft: 12, marginRight: 12, marginTop: 10, marginBottom: 15 }}
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

          { hasLink
            ? (
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={{ width: Dimensions.get('window').width - 20, backgroundColor: '#121212', height: 24, borderBottomWidth: 1, borderColor: '#696969', color: '#0057D9', marginLeft: 12, marginRight: 12, marginTop: 10, marginBottom: 15 }}
                  placeholder=" paste a link here"
                  placeholderTextColor="#696969"
                  maxLength={480}
                  value={addedLink}
                  onChangeText={addedLink => setAddedLink(addedLink)}

                />


              </View>
            ) : (<View />)}
          { renderSendAndCancel() }

          {/* <TouchableOpacity
            onPress={handleClose}
          >
            <MaterialCommunityIcons name="pencil-circle" size={70} color="#07dbd1" />
          </TouchableOpacity> */}
        </View>
        </TouchableWithoutFeedback>

        </Modal>

      <View>
        <FlatList
          ref={scrollRef}
          data={thoughts}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          contentContainerStyle={{ marginTop: 45, paddingBottom: 50 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onRefresh={refresh}
          refreshing={isLoading}
        />
      </View>

      <View style={{ position: 'absolute', left: 0, top: 0 }}>
        <FlatList
          horizontal
          data={categories}
          extraData={
          selectedCategory // for single item
        }
          style={styles.flatList}
          renderItem={({ item: rowData }) => (
            <TouchableOpacity
              onPress={() => recalculateCategory(rowData)}
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
  thumbnail2: {
    width: 50,
    height: 50,
    borderRadius: 5,
    // marginTop: 15,
    // marginBottom: 15,
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
    backgroundColor: '#000000',
    flexGrow: 0,
  },
  flatListModal: {
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
