import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, FlatList } from 'react-native'
import Firebase from '../../firebase'

import NotificationCellClass from '../cells/notificationCell';

class Notification extends React.Component {
    constructor(props) {
        super(props);

        // var today = new Date()
        // console.log(today)
        // var dd = String(today.getDate()).padStart(2, '0');
        // var mm = String(today.getMonth() + 1).padStart(2, '0');
        // var yyyy = today.getFullYear();
        // today = mm + dd + yyyy;

        // console.log(today)

        this.firestoreRef = Firebase.firestore().collection('users').doc(Firebase.auth().currentUser.uid).collection('notifications').orderBy("date_created", "desc")

        this.state = {
          isLoading: true,
          notificationsArray: [],
          navigation: this.props.navigation
        };
    }

    componentDidMount() {
        this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
    }
    
    componentWillUnmount(){
        this.unsubscribe();
    }

    _refresh = () => {
        this.setState({ isLoading: true });
        this.firestoreRef.onSnapshot(this.getCollection);
    };

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
            const notificationsArray = [];

            querySnapshot.forEach((res) => {
            const { 
                type,
                senderUID,
                recieverUID,
                postID,
                read,
                recieverToken,
                date_created,
                } = res.data();

                notificationsArray.push({
                    key: res.id,
                    type,
                    senderUID,
                    recieverUID,
                    postID,
                    read,
                    recieverToken,
                    date_created,
                });

            });

            this.setState({
                notificationsArray,
                isLoading: false,   
            });

    }

    render() {
        const { navigation } = this.props;
        const renderItem = ({ item }) => (
    
            <NotificationCellClass 
                type={item.type} 
                senderUID={item.senderUID} 
                recieverUID={item.recieverUID}
                postID={item.postID}
                read={item.read}
                recieverToken={item.recieverToken}
                date_created={item.date_created.toDate()}
                navigation={navigation}
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
                    data={this.state.notificationsArray}
                    renderItem={renderItem}
                    keyExtractor={item => item.key}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onRefresh={this._refresh}
                    refreshing={this.state.isLoading}
                />
              </View>   
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000'
    },
})

export default Notification