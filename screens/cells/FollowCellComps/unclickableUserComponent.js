import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Image, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import firebase from '../../../firebase'
import { clearUser } from '../../../redux/app-redux';
import { Ionicons } from '@expo/vector-icons';

const mapStateToProps = state => ({
  user: state.UserReducer.user,
});


//Only thing left is displaying the Post feed and styling the follow/unfollow/hide modal buttons
class UnclickableUserComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //Poster information from users collection
      uid: this.props.uid,
      navigation: this.props.navigation,
      username: '',
      profilePic: '',
      isLoading: true,
      currentUserUID: firebase.auth().currentUser.uid,
    };
  }

  componentDidMount() {
    this.getPosterUsername();
  }

    getPosterUsername = async() => {
      await firebase.firestore()
        .collection('users')
        .doc(this.state.uid)
        .get()
        .then((doc) => {
            if (doc.exists) {
                this.setState ({
                    username: doc.data().username,
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
      if (this.state.currentUserUID == this.state.uid) {
        this.state.navigation.navigate('Profile');
      } else {
        this.state.navigation.push('ClickedUserProfile',
          {
            posterUID: this.state.uid,
          });
      }
    }


    render() {
        //We want to render a profile pic and username side by side lookin nice and clickable. 
        //When clicked, the modal opens with all the user info. 
        //You can follow/unfollow from here.    
        if(this.state.isLoading){
            return(
                <View >
                    <View 
                      style={{flexDirection: 'row', justifyContent: 'left', alignItems: 'center', paddingLeft: 5, paddingBottom: 5 }} 
                    >
                        <ActivityIndicator size="small" color="#9E9E9E"/>
                        
                    </View>
                </View>
                
            )
        }    
        
            return (
                <View >
                    <View 
                      style={{flexDirection: 'row', justifyContent: 'left', alignItems: 'center', paddingLeft: 5, paddingBottom: 5 }} 
                    >

                        <Image
                            source={{ uri: this.state.profilePic }}
                            style={styles.thumbnail}
                        />
                        <Text style ={styles.tradeText}> {this.state.username}</Text>
                        
                    </View>
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
    paddingLeft: 10
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
});

export default connect(mapStateToProps)(UnclickableUserComponent);
