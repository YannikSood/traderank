import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Share} from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as Analytics from 'expo-firebase-analytics';
import Firebase from '../../../firebase';

const mapStateToProps = state => ({
    user: state.UserReducer.user,
  });

   


class ShareComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            postID: this.props.postID,
            posterUID: '',
            posterUsername:'',
            description: '',
            ticker: ''
        }
    }
    
  
    componentDidMount(){
        this.getPost();
    }
    onShare = async () => {
        try {
          const result = await Share.share({
            message:
              `@${this.state.posterUsername} is talking about ${this.state.ticker} - ${this.state.description} on Traderank. Check it out: https://testflight.apple.com/join/eHiBK1S3`,
          });
    
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
                ticker: doc.data().ticker
              });
            } else {
              // doc.data() will be undefined in this case
              console.log('No such document!');
            }
          });
      }

      

    render() {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'left', alignItems: 'center', color: 'FFFFFF' }}>
                <TouchableOpacity
                    style={{ color: '#FFFFFF' }}
                    onPress={this.onShare}
                >
                <Ionicons name="share-outline" size={30} color="white" />
            </TouchableOpacity>

            </View>
        );
    }
}

export default connect(mapStateToProps)(ShareComponent);