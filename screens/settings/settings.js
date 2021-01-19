import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import Firebase from '../../firebase'
import { Ionicons } from '@expo/vector-icons';

//Redux
import { connect } from 'react-redux';
import { clearUser } from './../../redux/app-redux';

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearUser: (temp) => { dispatch(clearUser(temp))}
     };
}


class Settings extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user: this.props.user,
            oldBio: "",
            newBio: "",
            profilePic: "",
            isLoading: false,
        }
        
    }

    componentDidMount() {
        this.pullBio()
    }
    
    
    //Pull bio from the db, save it to state
    pullBio = async() => {
        await Firebase.firestore()
        .collection('users')
        .doc(Firebase.auth().currentUser.uid)
        .get()
        .then(function(doc) {
            if (doc.exists) {
                this.setState ({
                    oldBio: doc.data().bio
                })
            } else {
                // doc.data() will be undefined in this case
                    console.log("No such document!");
            }
        }.bind(this));
    }

    changeBio = async() => {
        this.setState({ isLoading: true })
        // This should take us to the right place, adding a temp uid where we need it
        await Firebase.firestore()
        .collection('users')
        .doc(Firebase.auth().currentUser.uid)
        .set({
            bio: this.state.newBio
        }, { merge: true })
        .then(() => this.setState ({ 
            oldBio: this.state.newBio,
            isLoading: false
        }))
        .catch(function(error) {
            console.error("Error storing and retrieving image url: ", error);
        });
    }

    //Delete from users, usernames, all posts, following, followers, and likes?
    deleteAccount = async() => {

    }

    logOut = async() =>  {
        try {
            // this.props.clearUser()
            await Firebase.auth()
            .signOut()
            .then(() => this.props.navigation.navigate('Login'))
           
       }
       catch(error) {
           console.log(error);
       }
       this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    }

    render() {
        if(this.state.isLoading){
            return(
              <View styles = {styles.container}>
                <ActivityIndicator size="large" color="#9E9E9E"/>
              </View>
            )
        }    
        return (
            <View style={styles.container}>
                <TouchableOpacity 
                    onPress={this.logOut}>
                    <Text>Sign out 🤷{this.state.user.username}</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.inputBox}
                    value={this.state.newBio}
                    onChangeText={newBio => this.setState({ newBio })}
                    placeholder={this.state.oldBio}
                    autoCapitalize='none'
                />
                <TouchableOpacity onPress={() => { this.changeBio() }}> 
                    <Text>Change Bio</Text>    
                </TouchableOpacity>

                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputBox: {
        width: '85%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderBottomWidth: 1,
        textAlign: 'center'
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings);