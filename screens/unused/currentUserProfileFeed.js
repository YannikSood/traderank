//Pass props, render using cells, display single user feed using flatlistimport React from 'react'
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, FlatList } from 'react-native'
import firebase from '../../firebase'
import CurrentUserPostCell from '../cells/currentUserPostCell';


class CurrentUserPostFeed extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          isLoading: true,
          userPostsArray: [],
          userUID: firebase.auth().currentUser.uid,
          navigation: this.props.navigation
        };
        this.firestoreRef = 
        firebase.firestore()
        .collection('posts')
        .doc(this.state.userUID)
        .collection('posts')
        .orderBy("date_created", "desc");
    }

    componentDidMount() {
        this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
    }
    
    componentWillUnmount(){
        this.unsubscribe();
    }

    //username: this.state.username,
    // description: this.state.description,
    // uid: this.state.uid,
    // ticker: this.state.ticker,
    // image: this.state.storage_image_uri,
    // gain_loss: this.state.gain_loss,
    // date_created: new Date(),
    // likesCount: 0,
    // profit_loss: this.state.profit_loss,
    // percent_gain_loss: this.state.percent_gain_loss,
    // security: this.state.security,
    // postID: this.state.postID
    getCollection = (querySnapshot) => {
        const userPostsArray = [];
        querySnapshot.forEach((res) => {
        const { 
            username,
            uid,
            image,
            ticker,
            security,
            description,
            percent_gain_loss,
            profit_loss,
            gain_loss,
            cost_basis } = res.data();

            userPostsArray.push({
                key: res.id,
                username,
                uid,
                image,
                ticker,
                security,
                description,
                percent_gain_loss,
                profit_loss,
                gain_loss,
                cost_basis
            });
        });

        this.setState({
            userPostsArray,
            isLoading: false,   
        });

        // console.log(this.state.userPostsArray)
    }

    render() {
        const { navigation } = this.props;
        const renderItem = ({ item }) => (
    
            <CurrentUserPostCell 
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
                cost_basis={item.cost_basis}
            />
        );
        if(this.state.isLoading){
            return(
              <View style={styles.container}>
                <ActivityIndicator size="large" color="#9E9E9E"/>
              </View>
            )
        }    

        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.userPostsArray}
                    renderItem={renderItem}
                    keyExtractor={item => item.key}
                />
              </View>   
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: Dimensions.get('window').height * 0.24,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default CurrentUserPostFeed
