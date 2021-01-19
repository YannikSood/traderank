import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, FlatList } from 'react-native'
import Firebase from '../../firebase'

import LeaderboardCell from '../cells/leaderboardCell';

class LeaderboardGains extends React.Component {
    constructor(props) {
        super(props);

        // var today = new Date()
        // console.log(today)
        // var dd = String(today.getDate()).padStart(2, '0');
        // var mm = String(today.getMonth() + 1).padStart(2, '0');
        // var yyyy = today.getFullYear();
        // today = mm + dd + yyyy;

        // console.log(today)

        // this.firestoreRef = Firebase.firestore().collection('leaderboard').doc(today).collection('gains').orderBy("score", "desc").limit(100);

        this.state = {
          isLoading: true,
          leaderboardGains: [],
          navigation: this.props.navigation
        };
    }

    componentDidMount() {
        var today = new Date()
        console.log("today " + today)
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        var newToday = mm + dd + yyyy;
        console.log("new today " + newToday)

        this.unsubscribe = Firebase.firestore().collection('leaderboard').doc(newToday).collection('gains').orderBy("score", "desc").limit(100).onSnapshot(this.getCollection);
    }
    
    componentWillUnmount(){
        this.unsubscribe();
    }

    _refresh = () => {
        this.setState({ isLoading: true });
        var today = new Date()
        console.log("today " + today)
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = mm + dd + yyyy;
        Firebase.firestore().collection('leaderboard').doc(today).collection('gains').orderBy("score", "desc").limit(100).onSnapshot(this.getCollection);
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
            const leaderboardGains = [];
            var index = 1;

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
                date_created
                 } = res.data();

                leaderboardGains.push({
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
                    index,
                    date_created
                });

            index++;

            });

            this.setState({
                leaderboardGains,
                isLoading: false,   
            });

    }

    render() {
        const { navigation } = this.props;
        const renderItem = ({ item }) => (
    
            <LeaderboardCell 
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
                index = {item.index}
                date_created={item.date_created.toDate()}
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
                    data={this.state.leaderboardGains}
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
        backgroundColor: '#000000'
    },
})

export default LeaderboardGains