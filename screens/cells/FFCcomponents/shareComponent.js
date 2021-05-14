import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Share, NavigationContainer } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as Analytics from 'expo-firebase-analytics';
import * as Linking from 'expo-linking';
import Firebase from '../../../firebase';


const mapStateToProps = state => ({
  user: state.UserReducer.user,
});
const linking = {
  prefixes: ['https://google.com', 'google.com'],
};


class ShareComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postID: this.props.postID,
      posterUID: '',
      posterUsername: '',
      description: '',
      ticker: '',
      image: this.props.image,
      gain_loss: this.props.gain_loss,
      profit_loss: this.props.profit_loss,
    };
  }


  componentDidMount() {
    this.getPost();
  }

    onShare = async() => {
      //${this.state.image}
      try {
        const result = await Share.share({
          message:
              `@${this.state.posterUsername} posted a $${this.state.profit_loss} ${this.state.gain_loss} for $${this.state.ticker} on traderank. Check it out here: `,
          url: 'https://apps.apple.com/us/app/traderank/id1546959332', //this.state.url
        },
        {
          excludedActivityTypes: [
            'com.apple.UIKit.activity.Print',
            'com.apple.UIKit.activity.AirDrop',
            'com.apple.UIKit.activity.CopyToPasteboard',
            'com.apple.UIKit.activity.AddToReadingList',
            'com.apple.UIKit.activity.PostToFacebook',
            'com.apple.UIKit.activity.PostToGmail',
            'com.apple.UIKit.activity.PostToGoogleChrome',
          ],
        },);

        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        alert(error.message);
      }
    };

     //Get the post info
     getPost = async() => {
       await Firebase.firestore()
         .collection('globalPosts')
         .doc(this.state.postID)
         .get()
         .then((doc) => {
           if (doc.exists) {
             this.setState({
               posterUID: doc.data().uid,
               posterUsername: doc.data().username,
               description: doc.data().description,
               ticker: doc.data().ticker,
             });
           } else {
             // doc.data() will be undefined in this case
             console.log('No such document!');
           }
         });
     }


     render() {
       return (
          <View style={{ flexDirection: 'row', justifyContent: 'left', alignItems: 'center', color: 'FFFFFF', paddingBottom: 4 }}>
              <TouchableOpacity
                  style={{ color: '#FFFFFF' }}
                  onPress={this.onShare}
                >
                  <Ionicons name="share-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
       );
     }
}

export default connect(mapStateToProps)(ShareComponent);
