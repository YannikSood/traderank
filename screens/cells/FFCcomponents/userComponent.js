import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Image, ActivityIndicator } from 'react-native'
import Firebase from '../../../firebase'
import { connect } from 'react-redux';
import { clearUser } from '../../../redux/app-redux';
import { Ionicons } from '@expo/vector-icons';

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}


//Only thing left is displaying the Post feed and styling the follow/unfollow/hide modal buttons
class UserComponent extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            //Poster information from users collection
            postID: this.props.postID,
            navigation: this.props.navigation,
            posterUsername: "",
            posterUID: "",
            posterPic: "",
            currentUserUID: Firebase.auth().currentUser.uid
        }
        
    }
    
    componentDidMount() {
        this.getPosterUID()
    }

    getPosterUID = async() => {
        await Firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .get()
        .then(function(doc) {
            if (doc.exists) {
                this.setState ({
                    posterUID: doc.data().uid
                })
            } else {
                // doc.data() will be undefined in this case
                    console.log("No such document!");
            }
        }.bind(this));

        await Firebase.firestore()
        .collection('users')
        .doc(this.state.posterUID)
        .get()
        .then(function(doc) {
            if (doc.exists) {
                this.setState ({
                    posterUsername: doc.data().username,
                    posterPic: doc.data().profilePic,
                    isLoading: false
                })
            } else {
                // doc.data() will be undefined in this case
                    console.log("No such document!");
            }
        }.bind(this));
    }
    

    //We display the profile modal and pull a few more things, like the current user following/follower count and the remainder of the posters profile info
    getProfile = async() => {
        //Make sure the user is not clicking on their own profile. If they are, redirect them to the profile tab.
        //Removes the chance of them following themselves or having to show a different profile
        if (this.state.currentUserUID == this.state.posterUID) {
            this.state.navigation.navigate('Profile')
        }
        else {
            //Get the remainder of the poster's information. We already have the UID and username, we need bio and follower, following, and profile pic
            this.state.navigation.push('ClickedUserProfile', 
            {
                posterUID: this.state.posterUID,
                // navigation: this.props.navigation
            })
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
        else {
            return (
                <View >
                    <TouchableOpacity 
                        style={{flexDirection: 'row', justifyContent: 'left', alignItems: 'center' }} 
                        onPress={() => this.getProfile()} >

                        <Image
                            source={{ uri: this.state.posterPic }}
                            style={styles.thumbnail}
                        />
                        <Text style ={styles.tradeText}> {this.state.posterUsername}</Text>
                        
                    </TouchableOpacity>
                </View>
            )
        }
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },  
    tradeText: {
        fontSize: 16,
        fontWeight: 'bold',
        alignContent: 'center',
        color: '#FFFFFF',
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
    lineStyle:{
        borderWidth: 0.5,
        borderColor:'black',
        width: Dimensions.get('window').width,
        margin: 5
   },
   subheader: {
        fontSize: 22,
        fontWeight: 'bold',
        alignContent: 'center',
    },
    thumbnail: {
        width: 50,
        height: 50,
        borderRadius: 25
      }
})

export default connect(mapStateToProps)(UserComponent);