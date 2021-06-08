import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import * as Analytics from 'expo-firebase-analytics';
import firebase from '../../firebase';

import LeaderboardCell from '../cells/leaderboardCell';

class LeaderboardGains extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
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

    getCollection = async() => {
      const leaderboardGains = [];
      const index = 1;
      // this.setState({ isLoading: true });
      const getGainsCollection = firebase.functions().httpsCallable('getGainsCollection');
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const newToday = mm + dd + yyyy;
      getGainsCollection({
        index,
        newToday,
      }).then((result) => {
        this.setState({
          leaderboardGains: result.data,
          isLoading: false,
        });
      }).catch((err) => {
        console.log(err);
      });
    }


    getMore = async() => {
      //this.setState({ isLoading: true });
      const lastItemIndex = this.state.leaderboardGains.length - 1;
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const newToday = mm + dd + yyyy;
      const getMoreGains = firebase.functions().httpsCallable('getMoreGains');
      getMoreGains({
        score: this.state.leaderboardGains[lastItemIndex].score,
        lastItemIndex,
        newToday,
      })
        .then((result) => {
          this.setState({
            leaderboardGains: this.state.leaderboardGains.concat(result.data),
            isLoading: false,
          });
        })
        .catch((err) => {
          console.log('Error from leadarboard gains getMore');
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
          index={item.index}
          date_created={new Date(item.date_created.seconds * 1000 + item.date_created.nanoseconds / 1000000)}
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
    flex: 1,
    backgroundColor: '#000000',
  },
});

export default LeaderboardGains;
