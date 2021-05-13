import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import * as Analytics from 'expo-firebase-analytics';
import Firebase from '../../firebase';

import LeaderboardCell from '../cells/leaderboardCell';

class LeaderboardGains extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      leaderboardGains: [],
      navigation: this.props.navigation,
    };
  }

  componentDidMount() {
    Analytics.logEvent('Leaderboard_Gains_Clicked');
    this.getCollection();
  }

  //   componentWillUnmount() {
  //     this.unsubscribe();
  //   }

    _refresh = () => {
    //   this.setState({ isLoading: true });
      this.getCollection();
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
    getCollection = async() => {
      // const leaderboardGains = [];
      let index = 1;
      this.setState({ isLoading: true });
      const getGainsCollection = Firebase.functions().httpsCallable('getGainsCollection');
      getGainsCollection({
        index: index
      }).then((result) => {
        console.log("Result from getCollection: " + result)
        this.setState({
          leaderboardGains: result.leaderboardGains,
          isLoading: false,
        });

      }).catch(err => {
        console.log(err);
      })
      

      // const today = new Date();
      // const dd = String(today.getDate()).padStart(2, '0');
      // const mm = String(today.getMonth() + 1).padStart(2, '0');
      // const yyyy = today.getFullYear();
      // const newToday = mm + dd + yyyy;

      // await Firebase.firestore().collection('leaderboard').doc(newToday).collection('gains')
      //   .orderBy('score', 'desc')
      //   .limit(6)
      //   .get()
      //   .then((query) => {
      //     query.forEach((res) => {
      //       const {
      //         username,
      //         uid,
      //         image,
      //         ticker,
      //         security,
      //         description,
      //         percent_gain_loss,
      //         profit_loss,
      //         gain_loss,
      //         date_created,
      //         score,
      //       } = res.data();

      //       leaderboardGains.push({
      //         key: res.id,
      //         username,
      //         uid,
      //         image,
      //         ticker,
      //         security,
      //         description,
      //         percent_gain_loss,
      //         profit_loss,
      //         gain_loss,
      //         index,
      //         date_created,
      //         score,
      //       });

      //       index++;
      //     });

      //     this.setState({
      //       leaderboardGains,
      //       isLoading: false,
      //     });
      //   });
        
    }

    getMore = async() => {
    //   this.setState({ isLoading: true });
      const lastItemIndex = this.state.leaderboardGains.length - 1;
      // let index = lastItemIndex + 2;
      // console.log(index);

      const getMore = Firebase.functions().httpsCallable('getMore');
      getMore({
        score: this.state.leaderboardGains[lastItemIndex].score,
        lastItemIndex: lastItemIndex
      })
      .then((result)=> {
        console.log("Result from getMore: " + result);
        this.setState({
          leaderboardGains: this.state.leaderboardGains.concat(result.newLBGains),
          isLoading: false,
        });
        
      })
      .catch(err => {
        console.log("Error from leadarboard gains getMore");
      })

      // const today = new Date();
      // const dd = String(today.getDate()).padStart(2, '0');
      // const mm = String(today.getMonth() + 1).padStart(2, '0');
      // const yyyy = today.getFullYear();
      // const newToday = mm + dd + yyyy;

      // await Firebase.firestore().collection('leaderboard').doc(newToday).collection('gains')
      //   .orderBy('score', 'desc')
      //   .startAfter(this.state.leaderboardGains[lastItemIndex].score)
      //   .limit(7)
      //   .get()
      //   .then((query) => {
      //     const newLBGains = [];
      //     query.forEach((res) => {
      //       const {
      //         username,
      //         uid,
      //         image,
      //         ticker,
      //         security,
      //         description,
      //         percent_gain_loss,
      //         profit_loss,
      //         gain_loss,
      //         date_created,
      //         score,
      //       } = res.data();

      //       newLBGains.push({
      //         key: res.id,
      //         username,
      //         uid,
      //         image,
      //         ticker,
      //         security,
      //         description,
      //         percent_gain_loss,
      //         profit_loss,
      //         gain_loss,
      //         index,
      //         date_created,
      //         score,
      //       });

      //       index++;
      //     });

      //     this.setState({
      //       leaderboardGains: this.state.leaderboardGains.concat(newLBGains),
      //       isLoading: false,
      //     });
      //   });
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
          index={item.index}
          date_created={item.date_created.toDate()}
        />
      );
      if (this.state.isLoading) {
        return (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#9E9E9E" />
          </View>
        );
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
            onEndReached={() => { this.getMore(); }}
          />
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
  },
});

export default LeaderboardGains;
