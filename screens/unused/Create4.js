import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native'

import { connect } from 'react-redux';

import Firebase from '../../firebase'

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

class CreateReview extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            username: this.props.user.username,
            uid: this.props.user.id,
            image: this.props.route.params.image,
            ticker: this.props.route.params.ticker,
            strike: this.props.route.params.strike,
            call_put: this.props.route.params.call_put,
            exp: this.props.route.params.exp,
            description: this.props.route.params.description,
            profit: this.props.route.params.profit,
            percent_gain: this.props.route.params.percent_gain,
            gain_loss: 'gain',
            storage_image_uri: '',
            postID: '',
            isLoading: false
        }
    }

    uploadToStorage = async (docRef) => {
        const response = await fetch(this.state.image.uri);
        const file = await response.blob();
        await Firebase
        .storage()
        .ref(`screenshots/${Firebase.auth().currentUser.uid}/${docRef}`)
        .put(file);

        const url = await Firebase.storage().ref(`screenshots/${Firebase.auth().currentUser.uid}/${docRef}`).getDownloadURL();
        this.setState({
            postID: docRef,
            storage_image_uri: url
        })

    }

    onSubmit = async() => {

        //determine if this is a gain or loss based on profit
        if (this.state.profit > 0) {
            this.setState({
                gain_loss: 'gain',
                isLoading: true
            })
        }
        else {
            this.setState({
                gain_loss: 'loss',
                isLoading: true
            })
        }

        //create a new document in firestore with the path posts/uid/posts/postID
        //get the newly created post ID (docRef.id)
        //pass it to the upload to storagefunction
        //now we have the screenshot stored baby
        await Firebase.firestore()
        .collection('posts')
        .doc(Firebase.auth().currentUser.uid)
        .collection('posts')
        .add({
            uid: Firebase.auth().currentUser.uid 
        })
        .then((docRef) => this.uploadToStorage(docRef.id))
        .catch(function(error) {
            console.error("Error storing and retrieving image url: ", error);
        });

        //We set the docref.id to this.state.postID in the upload function, so we can access that document directly and add the remaining fields.
        await Firebase.firestore()
        .collection('posts')
        .doc(Firebase.auth().currentUser.uid)
        .collection('posts')
        .doc(this.state.postID)
        .set ({
            username: this.state.username,
            description: this.state.description,
            uid: Firebase.auth().currentUser.uid,
            ticker: this.state.ticker,
            strike: this.state.strike,
            image: this.state.storage_image_uri,
            call_put: this.state.call_put,
            exp: this.state.exp,
            profit: this.state.profit,
            percent_gain: this.state.percent_gain,
            gain_loss: this.state.gain_loss,
            date_created: new Date(),
            likesCount: 0
        })
        .catch(function(error) {
            console.error("Error writing document to user posts: ", error);
        });

        //And now we are storing user posts. Now, we do the same thing for global posts, to display in the global feed
        await Firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .set ({
            username: this.state.username,
            description: this.state.description,
            uid: Firebase.auth().currentUser.uid,
            ticker: this.state.ticker,
            strike: this.state.strike,
            image: this.state.storage_image_uri,
            call_put: this.state.call_put,
            exp: this.state.exp,
            profit: this.state.profit,
            percent_gain: this.state.percent_gain,
            gain_loss: this.state.gain_loss,
            post_id: this.state.postID,
            date_created: new Date(),
            likesCount: 0
        })
        .catch(function(error) {
            console.error("Error writing document to global posts: ", error);
        });

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

    

    render() {
        if(this.state.isLoading){
            return(
              <View style={styles.container}>
                <ActivityIndicator size="large" color="#9E9E9E"/>
              </View>
            )
        }   
        return (
            <View style={styles.scroller}>
                <Text style = {styles.headerText}>get ranked</Text>

                <Text style = {styles.subheaderText}>review & confirm</Text>

                <Image
                        source={{ uri: this.state.image.uri }}
                        style={styles.thumbnail}
                />
                


                <Text style = {styles.textContainer}>
                    <Text style = {styles.tradeText}> {this.state.ticker} ${this.state.strike} {this.state.call_put} </Text>
                    <Text style = {styles.regularText}>expiring on</Text>  
                    <Text style = {styles.tradeText}> {this.state.exp} </Text>
                </Text>

                <Text style = {styles.textContainer}>
                    <Text style = {styles.tradeText}> {this.state.username} </Text>
                    <Text style = {styles.regularText}>made</Text>  
                    <Text style = {styles.tradeText}> ${this.state.profit} </Text>
                    <Text style = {styles.regularText}>on this trade for a </Text>
                    <Text style = {styles.tradeText}>{this.state.percent_gain}% gain</Text>
                </Text>
               
                <Text style = {styles.regularText}> {this.state.description}</Text>

                <TouchableOpacity   
                    onPress={() => this.onSubmit()} 
                    style={styles.nextButton}>
                        <Text style={styles.buttonText}>post this trade!</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => this.props.navigation.navigate('CreateConfirm', { 
                        image: this.state.image, 
                        ticker: this.state.ticker, 
                        strike: this.state.strike, 
                        call_put: this.state.call_put, 
                        exp: this.state.exp
                    })}
                    style={styles.nextButton}>
                        <Text style={styles.buttonText}>back</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // marginTop: 100,
        // marginBottom: 100,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scroller: {
        marginTop: 50,
        marginBottom: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    view: {
        alignItems: 'center',
    },
    thumbnail: {
        width: 300,
        height: 300,
        paddingBottom: 20,
        resizeMode: "contain"
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
    nextButton: {
        marginTop: 30,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#5233FF',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 5,
        width: 200
    },
    button: {
        marginTop: 30,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#5233FF',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 5,
        width: 200
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
    headerText: {
        fontSize: 30,
        alignItems: 'center',
        fontWeight: 'bold',
        paddingBottom: 10
    },
    subheaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        alignContent: 'center',
        paddingBottom: 10
    },
    tradeText: {
        fontSize: 16,
        fontWeight: 'bold',
        alignContent: 'center',
        paddingBottom: 10,
        paddingTop: 20
    },
    regularText: {
        fontSize: 15,
        alignContent: 'center',
        paddingBottom: 10
    },
    textContainer: {
        alignContent: 'center',
        paddingBottom: 10,
        paddingTop: 20
    },
    twoPickers: {
        width: 200,
        height: 88,
    },
    twoPickerItems: {
    height: 88,
    },
})

export default connect(mapStateToProps)(CreateReview);