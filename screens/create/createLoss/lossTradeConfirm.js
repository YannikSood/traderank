import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, TextInput, Image, Alert, ActivityIndicator, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native'
import { connect } from 'react-redux';
import { getUser } from '../../../redux/app-redux';
import { Ionicons } from '@expo/vector-icons';

import Firebase from '../../../firebase'

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: () => { dispatch(getUser())}
     };
}

class LossTradeConfirm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            image: this.props.route.params.image,
            ticker: this.props.route.params.ticker,
            security: this.props.route.params.security,
            profit_loss: this.props.route.params.profit_loss,
            percent_gain_loss: this.props.route.params.percent_gain_loss,
            gain_loss: "loss",
            username: this.props.user.username,
            uid: this.props.user.id,
            description: " ",
            storage_image_uri: '',
            postID: '',
            isLoading: false,
            postCount: 0,
            modalOpen: false
        }
    }

    uploadToStorage = async (docRef) => {
        const response = await fetch(this.state.image.uri);
        const file = await response.blob();
        await Firebase
        .storage()
        .ref(`screenshots/${this.state.uid}/${docRef}`)
        .put(file);

        const url = await Firebase.storage().ref(`screenshots/${this.state.uid}/${docRef}`).getDownloadURL();
        this.setState({
            postID: docRef,
            storage_image_uri: url
        })

    }

    onSubmit = async() => {

        //create a new document in firestore with the path posts/uid/posts/postID
        //get the newly created post ID (docRef.id)
        //pass it to the upload to storagefunction
        //now we have the screenshot stored baby
        await Firebase.firestore()
        .collection('globalPosts')
        .add({
            uid: this.state.uid
        })
        .then((docRef) => this.uploadToStorage(docRef.id))
        .catch(function(error) {
            console.error("Error storing and retrieving image url: ", error);
        });

        //And now we are storing user posts. Now, we do the same thing for global posts, to display in the global feed
        await Firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .set ({
            username: this.state.username,
            description: this.state.description,
            uid: this.state.uid,
            ticker: this.state.ticker,
            image: this.state.storage_image_uri,
            gain_loss: this.state.gain_loss,
            date_created: new Date(),
            likesCount: 0,
            profit_loss: this.state.profit_loss,
            percent_gain_loss: this.state.percent_gain_loss,
            security: this.state.security,
            postID: this.state.postID,
            score: 0,
            postType: 2,
            commentsCount: 0
        })
        .catch(function(error) {
            console.error("Error writing document to global posts: ", error);
        });

        await Firebase.firestore()
        .collection('loss')
        .doc(this.state.postID)
        .set ({
            username: this.state.username,
            description: this.state.description,
            uid: this.state.uid,
            ticker: this.state.ticker,
            image: this.state.storage_image_uri,
            gain_loss: this.state.gain_loss,
            date_created: new Date(),
            likesCount: 0,
            profit_loss: this.state.profit_loss,
            percent_gain_loss: this.state.percent_gain_loss,
            security: this.state.security,
            postID: this.state.postID,
            score: 0,
            postType: 2,
            commentsCount: 0
        })
        .catch(function(error) {
            console.error("Error writing document to global posts: ", error);
        });

        //Update post count
        await Firebase.firestore()
        .collection('users')
        .doc(Firebase.auth().currentUser.uid)
        .set ({
            postCount: this.state.postCount + 1
        }, { merge: true })
        .catch(function(error) {
            console.error("Error writing document to user collection: ", error);
        })


        this.setState({
            isLoading: false
        })
        //Cool, now we can redirect to home, where we will see the post at the top of the global feed.
        this.props.navigation.navigate('Home')
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'Create' }],
          });
    }

    checkAndNext = async() => {
        if (this.state.description.length != 0) {
            await Firebase.firestore()
            .collection('users')
            .doc(Firebase.auth().currentUser.uid)
            .get()
            .then(function(doc){
                if (doc.exists) {
                    this.setState({
                        postCount: doc.data().postCount,
                        isLoading: true
                    })
                } else {
                    console.log("No such document!");
                }
            }.bind(this))
            .then(() => this.onSubmit())

        }
        else {
            Alert.alert(
                'please enter a caption',
                'caption cannot be blank',
                [
                  { text: 'OK', onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
              );
        }
    }

    openImageModal = () => {
        this.setState({modalOpen: true})
    }

    closeImageModal = () => {
        this.setState({modalOpen: false})
    }

    render() {
        if(this.state.isLoading){
            return(
              <View style={styles.activityContainer}>
                <ActivityIndicator size="large" color="#9E9E9E"/>
              </View>
            )
        }   
        return (

            <KeyboardAvoidingView 
            style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }} 
            behavior="padding" enabled   
            keyboardVerticalOffset={100}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View
                    style={styles.container}>

                    <Modal
                        animationType="slide"
                        visible={this.state.modalOpen}
                        presentationStyle="pageSheet"
                        onDismiss={() => this.closeImageModal()}
                    >
                            
                        <View  style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity 
                                style={{padding: 15}}
                                onPress = { () => this.closeImageModal() }>
                                <Ionicons name="ios-close-circle" size={30} color="red" />
                            </TouchableOpacity>

                            <Image
                                source={{ uri: this.state.image.uri }}
                                style={styles.fullScreenImage}
                            />
                        </View>

                    </Modal>

                    
                    <Text style = {styles.textContainer}>
                        <Text style = {styles.boldText}>{this.state.username}</Text>
                        <Text style = {styles.labelText}> traded </Text> 
                        <Text style = {styles.boldText}>${this.state.ticker} </Text>
                        <Text style = {styles.boldText}>[{this.state.security}]</Text>

                    </Text>

                    <Text style = {styles.textContainer}>
                            <Text style = {styles.boldGainText}>-${this.state.profit_loss} </Text>
                            <Text style = {styles.labelText}> 🥴 </Text>  
                            <Text style = {styles.boldGainText}>-{this.state.percent_gain_loss}% </Text>
                    </Text>

                    <TouchableOpacity onPress={() => this.openImageModal()} >

                        <Image
                            source={{ uri: this.state.image.uri }}
                            style={styles.thumbnail}
                        />

                    </TouchableOpacity>


                    <View style={{flexDirection: 'column', justifyContent: 'left', alignItems: 'center' }}>

                        <Text style={styles.labelText}>lastly, caption your trade:</Text>
                       <View style={{flexDirection: 'row', justifyContent: 'center' }}>

                            <TextInput
                                style={styles.inputBox}
                                value={this.state.description}
                                onChangeText={description => this.setState({ description })}
                                placeholder='I love tendies... '
                                autoCapitalize='none'
                                multiline={true}
                                maxLength={400}
                            />
                        </View>
                        
                    </View>
                    

                    <TouchableOpacity  
                        onPress={() => this.checkAndNext()}
                        style={styles.gainButton}>
                                <Text style={styles.buttonText}>get ranked🎉</Text>
                    </TouchableOpacity>
                    
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        )
        
    }
}

const styles = StyleSheet.create({
    activityContainer : {
        flex: 1,
        // marginBottom: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        paddingBottom: 50
    },
    gainButton: {
        marginTop: 30,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#00cc00',
        borderRadius: 5,
        width: 140
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingBottom: 10,
        color: '#FFFFFF'
    },
    subheaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        alignContent: 'center',
        paddingBottom: 10,
        color: '#FFFFFF'
    },
    thumbnail: {
        width: 200,
        height: 200,
        resizeMode: "contain",
        marginBottom: 20
    },
    labelText: {
        fontSize: 18,
        // margin: 10,
        color: '#FFFFFF'
    },
    boldText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    boldGainText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#cc0000',
    },
    inputBoxText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        paddingTop: 15,
        color: '#FFFFFF'
    },
    inputBox: {
        width: '90%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderWidth: 1,
        textAlign: 'center',
        color: '#FFFFFF'
    },
    textContainer: {
        alignContent: 'center',
        paddingBottom: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    fullScreenImage: {
        width:  Dimensions.get('window').width,
        height: Dimensions.get('window').height ,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: "contain",
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(LossTradeConfirm)