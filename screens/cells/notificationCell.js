import React, { useState } from 'react';
import {  Alert, Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import TimeAgo from 'react-native-timeago';
import firebase from '../../firebase';
import UserComponent from './FFCcomponents/userComponent';
import MiscUserComponent from './FollowCellComps/userComponent';

class NotificationCellClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type,
      senderUID: this.props.senderUID,
      recieverUID: this.props.recieverUID,
      postID: this.props.postID,
      read: this.props.read,
      recieverToken: this.props.recieverToken,
      notification_date_created: this.props.date_created,
      senderUsername: '',
      username: '',
      image: '',
      ticker: '',
      security: '',
      description: '',
      profit_loss: '',
      percent_gain_loss: '',
      gain_loss: '',
      date_created: new Date(),
      navigation: this.props.navigation,
      Tusername: '',
      Tdescription: '',
      Timage: '',
      Tdate_created: new Date(),
      TlikesCount: '',
      TcommentsCount: '',
      TviewsCount: '',
      Tcategory: '',
      TpostID: '',
      Tuid: '',
      Tlink: '',
      TmediaType: '',
    };
  }

  componentDidMount() {
    this.getUsernames();
  }

    getUsernames = async() => {
      await firebase.firestore()
        .collection('users')
        .doc(this.state.senderUID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.setState({
              senderUsername: doc.data().username,
            });
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        });
    }

    showPostCommentsPage = async() => {
      await firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.setState({
              username: doc.data().username,
              image: doc.data().image,
              ticker: doc.data().ticker,
              security: doc.data().security,
              description: doc.data().description,
              profit_loss: doc.data().profit_loss,
              percent_gain_loss: doc.data().percent_gain_loss,
              gain_loss: doc.data().gain_loss,
              date_created: doc.data().date_created.toDate(),
            });
          }
        });

      this.state.navigation.push('ClickedPostPage',
        {
          username: this.state.username,
          image: this.state.image,
          ticker: this.state.ticker,
          security: this.state.security,
          description: this.state.description,
          profit_loss: this.state.profit_loss,
          percent_gain_loss: this.state.percent_gain_loss,
          gain_loss: this.state.gain_loss,
          postID: this.state.postID,
          date_created: this.state.date_created,
        });
    }

    showPostPage = async() => {
      await firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.setState({
              username: doc.data().username,
              image: doc.data().image,
              ticker: doc.data().ticker,
              security: doc.data().security,
              description: doc.data().description,
              profit_loss: doc.data().profit_loss,
              percent_gain_loss: doc.data().percent_gain_loss,
              gain_loss: doc.data().gain_loss,
              date_created: doc.data().date_created.toDate(),
            });
          }
        });

      this.state.navigation.push('SpecialClickedPostPage',
        {
          username: this.state.username,
          image: this.state.image,
          ticker: this.state.ticker,
          security: this.state.security,
          description: this.state.description,
          profit_loss: this.state.profit_loss,
          percent_gain_loss: this.state.percent_gain_loss,
          gain_loss: this.state.gain_loss,
          postID: this.state.postID,
          date_created: this.state.date_created,
        });
    }


    showThoughtsPage = async() => {
      await firebase.firestore()
        .collection('thoughts')
        .doc(this.state.postID)
        .get()
        .then((doc) => {
          this.setState({
            Tusername: doc.data().username,
            Tdescription: doc.data().description,
            Timage: doc.data().image,
            Tdate_created: doc.data().date_created,
            TlikesCount: doc.data().likesCount,
            TcommentsCount: doc.data().commentsCount,
            TviewsCount: doc.data().viewsCount,
            Tcategory: doc.data().category,
            TpostID: doc.data().postID,
            Tuid: doc.data().uid,
            Tlink: doc.data().link,
            TmediaType: doc.data().mediaType,
          });
        });
      // console.log(this.state.Tusername)
      this.state.navigation.push('ThoughtsDetails',
        {
          username: this.state.Tusername,
          description: this.state.Tdescription,
          image: this.state.Timage,
          date_created: this.state.Tdate_created,
          likesCount: this.state.TlikesCount,
          commentsCount: this.state.TcommentsCount,
          viewsCount: this.state.TviewsCount,
          category: this.state.Tcategory,
          postID: this.state.TpostID,
          uid: this.state.Tuid,
          link: this.state.Tlink,
          mediaType: this.state.TmediaType,

        });
    }

    showThoughtsComments = async() => {
      await firebase.firestore()
        .collection('thoughts')
        .doc(this.state.postID)
        .get()
        .then((doc) => {
          this.setState({
            Tusername: doc.data().username,
            Tdescription: doc.data().description,
            Timage: doc.data().image,
            Tdate_created: doc.data().date_created,
            TlikesCount: doc.data().likesCount,
            TcommentsCount: doc.data().commentsCount,
            TviewsCount: doc.data().viewsCount,
            Tcategory: doc.data().category,
            TpostID: doc.data().postID,
            Tuid: doc.data().uid,
            Tlink: doc.data().link,
            TmediaType: doc.data().mediaType,
          });
        });
      // console.log(this.state.Tusername)
      this.state.navigation.push('ThoughtsComments',
        {
          username: this.state.Tusername,
          description: this.state.Tdescription,
          image: this.state.Timage,
          date_created: this.state.Tdate_created,
          likesCount: this.state.TlikesCount,
          commentsCount: this.state.TcommentsCount,
          viewsCount: this.state.TviewsCount,
          category: this.state.Tcategory,
          postID: this.state.TpostID,
          posterUID: this.state.Tuid,
          link: this.state.Tlink,
          mediaType: this.state.TmediaType,

        });
    }

    determineFormat = () => {
      if (this.state.type == 0) {
        return (
          <TouchableOpacity
            style={styles.feedCell}
            onPress={() => this.showPostPage()}
          >
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row' }}>

                <MiscUserComponent uid={this.state.senderUID} navigation={this.state.navigation} />

                <Text style={styles.textStyle2}> liked your post</Text>

              </View>
              <View style={styles.timeContainer}>

                <TimeAgo style={{ color: '#696969' }} time={this.state.notification_date_created} />

              </View>
            </View>

            {/* <View style = {styles.lineStyle} /> */}
          </TouchableOpacity>
        );
      }

      if (this.state.type === 1) {
        return (
          <TouchableOpacity
            style={styles.feedCell}
            onPress={() => this.showPostCommentsPage()}
          >
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row' }}>

                <MiscUserComponent uid={this.state.senderUID} navigation={this.state.navigation} />

                <Text style={styles.textStyle2}> commented on your post</Text>


              </View>
              <View style={styles.timeContainer}>

                <TimeAgo style={{ color: '#696969' }} time={this.state.notification_date_created} />

              </View>
            </View>

            {/* <View style = {styles.lineStyle} /> */}
          </TouchableOpacity>
        );
      }

      if (this.state.type === 2) {
        return (
          <View style={styles.feedCell}>
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row' }}>

                <MiscUserComponent uid={this.state.senderUID} navigation={this.state.navigation} />

                <Text style={styles.textStyle2}> followed you</Text>


              </View>
              <View style={styles.timeContainer}>

                <TimeAgo style={{ color: '#696969' }} time={this.state.notification_date_created} />

              </View>
            </View>
            {/*
                    <View style = {styles.lineStyle} /> */}
          </View>

        );
      }

      if (this.state.type === 3) {
        return (
          <TouchableOpacity
            style={styles.feedCell}
            onPress={() => this.showPostCommentsPage()}
          >
            <View style={{ flexDirection: 'column' }}>

              <View style={{ flexDirection: 'row' }}>

                <MiscUserComponent uid={this.state.senderUID} navigation={this.state.navigation} />

                <Text style={styles.textStyle2}> liked your comment</Text>

              </View>
              <View style={styles.timeContainer}>

                <TimeAgo style={{ color: '#696969' }} time={this.state.notification_date_created} />

              </View>
            </View>

            {/* <View style = {styles.lineStyle} /> */}
          </TouchableOpacity>
        );
      }

      if (this.state.type === 4) {
        return (
          <TouchableOpacity
            style={styles.feedCell}
            onPress={() => this.props.navigation.navigate('Leaderboard')}
          >
            <View style={{ flexDirection: 'column' }}>

              <View style={{ flexDirection: 'row' }}>

                <Text style={styles.textStyle}>you ranked on the gains leaderboard!</Text>


              </View>
              <View style={styles.timeContainer}>

                <TimeAgo style={{ color: '#696969' }} time={this.state.notification_date_created} />

              </View>
            </View>

            {/* <View style = {styles.lineStyle} /> */}
          </TouchableOpacity>
        );
      }

      if (this.state.type === 5) {
        return (
          <TouchableOpacity
            style={styles.feedCell}
            onPress={() => this.props.navigation.navigate('Leaderboard')}
          >
            <View style={{ flexDirection: 'column' }}>

              <View style={{ flexDirection: 'row' }}>

                <Text style={styles.textStyle}>you ranked on the loss leaderboard!</Text>


              </View>
              <View style={styles.timeContainer}>

                <TimeAgo style={{ color: '#696969' }} time={this.state.notification_date_created} />

              </View>
            </View>

            {/* <View style = {styles.lineStyle} /> */}
          </TouchableOpacity>
        );
      }

      if (this.state.type === 6) {
        return (
          <TouchableOpacity
            style={styles.feedCell}
            onPress={() => this.showPostCommentsPage()}
          >
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row' }}>

                <MiscUserComponent uid={this.state.senderUID} navigation={this.state.navigation} />

                <Text style={styles.textStyle2}> replied to your comment</Text>


              </View>
              <View style={styles.timeContainer}>

                <TimeAgo style={{ color: '#696969' }} time={this.state.notification_date_created} />

              </View>
            </View>

            {/* <View style = {styles.lineStyle} /> */}
          </TouchableOpacity>
        );
      }

      if (this.state.type == 10) {
        return (
          <TouchableOpacity
            style={styles.feedCell}
            onPress={() => this.showThoughtsPage()}
          >
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row' }}>

                <MiscUserComponent uid={this.state.senderUID} navigation={this.state.navigation} />

                <Text style={styles.textStyle2}> liked your thought</Text>

              </View>
              <View style={styles.timeContainer}>

                <TimeAgo style={{ color: '#696969' }} time={this.state.notification_date_created} />

              </View>
            </View>

            {/* <View style = {styles.lineStyle} /> */}
          </TouchableOpacity>
        );
      }

      if (this.state.type === 11) {
        return (
          <TouchableOpacity
            style={styles.feedCell}
            onPress={() => this.showThoughtsComments()}
          >
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row' }}>

                <MiscUserComponent uid={this.state.senderUID} navigation={this.state.navigation} />

                <Text style={styles.textStyle2}> commented on your thought</Text>

              </View>
              <View style={styles.timeContainer}>

                <TimeAgo style={{ color: '#696969' }} time={this.state.notification_date_created} />

              </View>
            </View>

            {/* <View style = {styles.lineStyle} /> */}
          </TouchableOpacity>
        );
      }

      if (this.state.type === 12) {
        return (
          <TouchableOpacity
            style={styles.feedCell}
            onPress={() => this.showThoughtsComments()}
          >
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row' }}>

                <MiscUserComponent uid={this.state.senderUID} navigation={this.state.navigation} />

                <Text style={styles.textStyle2}> replied to your comment</Text>

              </View>
              <View style={styles.timeContainer}>

                <TimeAgo style={{ color: '#696969' }} time={this.state.notification_date_created} />

              </View>
            </View>

            {/* <View style = {styles.lineStyle} /> */}
          </TouchableOpacity>
        );
      }
    }

    showUserProfile = () => {
      this.state.navigation.push('ClickedUserProfile',
        {
          posterUID: this.state.senderUID,
        });
    }

    render() {
      return (
        <View style={styles.commentFeedCell}>

          { this.determineFormat() }
        </View>

      );
    }
}


const styles = StyleSheet.create({

  feedCell: {
    // backgroundColor: '#3F3F41',
    paddingTop: 10,
    backgroundColor: '#121212',
    flex: 1,
    width: Dimensions.get('window').width,
    marginTop: 5,
    borderBottomWidth: 1,
    borderRadius: 15,

  },
  commentTextColor: {
    padding: 20,
    color: '#3F3F41',
    fontSize: 16,
  },
  commentorUsername: {
    color: '#3F3F41',
    fontWeight: 'bold',
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'white',
    width: Dimensions.get('window').width - 50,
    margin: 10,
  },
  timeContainer: {
    paddingLeft: 10,
    paddingTop: 7,
  },
  textStyle: {
    color: '#FFFFFF',
    // paddingLeft: 20,
    paddingTop: 14,
    fontWeight: 'bold',
    fontSize: 16,
  },
  textStyle2: {
    color: '#FFFFFF',
    paddingTop: 15,
    // fontWeight: 'bold',
    fontSize: 16,
  },

});

export default NotificationCellClass;
