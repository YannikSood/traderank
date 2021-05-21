import React, { useState } from 'react';
import {  Alert, Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import firebase from '../../firebase';
import MiscUserComponent from './FollowCellComps/userComponent';


//The cell you see when you scroll through the home screen

class FollowCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: this.props.uid,
      navigation: this.props.navigation,
      isLoading: false,
      currentUser: firebase.auth().currentUser.uid,
    };
  }

  // componentDidMount() {
  //     console.log(this.state.date_created)
  //     // moment(this.state.date_created.t.seconds, "x").format("DD MMM YYYY hh:mm a")
  // }


  // showProfile = () => {
  //     console.log(this.state.date_created)
  //     this.state.navigation.push('ClickedUserPage',
  //     {
  //         username: this.state.username,
  //         image: this.state.image,
  //         ticker: this.state.ticker,
  //         security: this.state.security,
  //         description: this.state.description,
  //         profit_loss: this.state.profit_loss,
  //         percent_gain_loss: this.state.percent_gain_loss,
  //         gain_loss: this.state.gain_loss,
  //         postID: this.state.postID,
  //         date_created: this.state.date_created
  //     })
  // }


  render() {
    return (
      <View style={styles.gainFeedCell}>

        <MiscUserComponent uid={this.state.uid} navigation={this.state.navigation} />
        {/* <View style={styles.lineStyle} /> */}

      </View>
    );
  }
}


const styles = StyleSheet.create({
  gainFeedCell: {
    paddingTop: 10,
    backgroundColor: '#121212',
    flex: 1,
    width: Dimensions.get('window').width,
    marginTop: 5,
    borderBottomWidth: 1,
    borderRadius: 15,
  },
  tradeText: {
    fontSize: 20,
    fontWeight: 'bold',
    alignContent: 'center',
    paddingBottom: 10,
    color: '#FFFFFF',
    // paddingTop: 20
  },
  regularText: {
    fontSize: 18,
    alignContent: 'center',
    paddingBottom: 10,
    color: '#FFFFFF',
    paddingHorizontal: 0,
  },
  regularTradeText: {
    fontSize: 20,
    alignContent: 'center',
    paddingBottom: 10,
    color: '#FFFFFF',
  },
  gainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00cc00',
  },
  lossText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#cc0000',
  },
  textContainer: {
    alignContent: 'center',
    paddingBottom: 10,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#121212',
  },
  pnlContainer: {
    flex: 1,
    // justifyContent: 'left',
    // alignContent: 'left',
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    // backgroundColor: '#121212'
  },
  securityContainer: {
    alignContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,
  },
  descriptionContainer: {
    alignItems: 'flex-start',
    padding: 10,
    backgroundColor: '#121212',
  },
  timeContainer: {
    paddingLeft: 20,
    color: '#FFFFFF',
    // backgroundColor: '#696969'
  },
  buttonContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 22,
    marginRight: 22,
    paddingTop: 10,
    paddingBottom: 10,
    color: '#FFFFFF',
    // backgroundColor: '#696969'
  },
  thumbnailContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    paddingBottom: 10,
    backgroundColor: '#121212',
  },
  thumbnail: {
    width:  Dimensions.get('window').width,
    height: 250,
    resizeMode: 'contain',
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'white',
    width: Dimensions.get('window').width,
    marginBottom: 10,
  },
});

export default FollowCell;
