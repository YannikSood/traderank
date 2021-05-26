import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Image, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import firebase from '../../../firebase'
import { clearUser } from '../../../redux/app-redux';
import { Ionicons } from '@expo/vector-icons';
import CachedImage from '../../image/CachedImage';
const mapStateToProps = state => ({
  user: state.UserReducer.user,
});


//Only thing left is displaying the Post feed and styling the follow/unfollow/hide modal buttons
class CommentUserComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //Poster information from users collection
      posterUID: this.props.posterUID,
      navigation: this.props.navigation,
      posterUsername: '',
      profilePic: '',
      currentUserUID: firebase.auth().currentUser.uid,
      isLoading: true
    };
  }

  componentDidMount() {
    this.getPosterUsername();
  
  }

    getPosterUsername = async() => {
      await firebase.firestore()
        .collection('users')
        .doc(this.state.posterUID)
        .get()
        .then((doc) => {
            if (doc.exists) {
                this.setState ({
                    posterUsername: doc.data().username,
                    profilePic: doc.data().profilePic,
                    isLoading: false
                })
            } else {
                // doc.data() will be undefined in this case
                    console.log("No such document!");
            }
        });
    }

    getProfile = () => {
      //Make sure the user is not clicking on their own profile. If they are, redirect them to the profile tab.
      if (this.state.currentUserUID == this.state.posterUID) {
        this.state.navigation.navigate('Profile');
      } else {
        this.state.navigation.push('ClickedUserProfile',
          {
            posterUID: this.state.posterUID,
            // navigation: this.props.navigation
          });
      }
    }


    render() {
        //We want to render a profile pic and username side by side lookin nice and clickable. 
        //When clicked, the modal opens with all the user info. 
        //You can follow/unfollow from here.    
        if(this.state.isLoading){
            return(
              <View>
                <ActivityIndicator size="small" color="#9E9E9E"/>
              </View>
            )
        }    
        
            return (
                <View>
                    <TouchableOpacity 
                        style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 5 }} 
                        onPress={() => this.getProfile()} >
                        <CachedImage
                              source={{ uri: `${this.state.profilePic}` }}
                              cacheKey={`${this.state.profilePic}t`}
                              backgroundColor="transparent"
                              style={styles.thumbnail}
                         />

                        
                        <Text style ={styles.tradeText}> {this.state.posterUsername}</Text>
                        
                    </TouchableOpacity>
                </View>
            )
        
        
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tradeText: {
    fontSize: 16,
    fontWeight: 'bold',
    alignContent: 'center',
    color: '#FFFFFF',
    marginBottom: 5
  },
  modalContainer: {
    marginTop: 75,
  },
  profileInfoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    width: Dimensions.get('window').width,
    margin: 5,
  },
  subheader: {
    fontSize: 22,
    fontWeight: 'bold',
    alignContent: 'center',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  thumbnailImage: {
    width:  Dimensions.get('window').width - 50,
    height: 300,
    borderRadius: 15,
  }
});

export default connect(mapStateToProps)(CommentUserComponent);
