import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../../../firebase';
import { clearUser } from '../../../redux/app-redux';

const mapStateToProps = state => ({
  user: state.UserReducer.user,
});


class DeleteComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postID: this.props.postID,
      currentUserUID: firebase.auth().currentUser.uid,
      isLoading: false,
      thoughtsCount: 0,
      deleteClicked: false,
    };
  }

    //----------------------------------------------------------
    //Delete the post from global and user post dbs. also decrement the post count by one>
    deletePost = async() => {
      this.setState({
        isLoading: true,
      });

      await firebase.firestore()
        .collection('users')
        .doc(this.state.currentUserUID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.setState({
              thoughtsCount: doc.data().thoughtsCount,
            });
          } else {
            // doc.data() will be undefined in this case, so this wont even come up honestly
            console.log('No such document!');
          }
        });


      await firebase.firestore()
        .collection('thoughts')
        .doc(this.state.postID)
        .delete()
        .catch((error) => {
          console.error('Error deleting ', error);
        })
        .then(() => this.reducePostCount());

      await firebase.firestore()
        .collection('comments')
        .doc(this.state.postID)
        .delete()
        .catch((error) => {
          console.error('Error deleting ', error);
        });

      await firebase.firestore()
        .collection('likes')
        .doc(this.state.postID)
        .delete()
        .catch((error) => {
          console.error('Error deleting ', error);
        });

      await firebase
        .storage()
        .ref(`screenshots/${this.state.currentUserUID}/${this.state.postID}`)
        .delete();
    }

    reducePostCount = async() => {
      await firebase.firestore()
        .collection('users')
        .doc(this.state.currentUserUID)
        .set({
          thoughtsCount: this.state.thoughtsCount - 1,
        }, { merge: true })
        .then(() => this.setState({
          thoughtsCount: this.state.thoughtsCount - 1,
          isLoading: false,
          deleteClicked: true,
        }));
    }

    showDeletionAlert = () => {
      Alert.alert(
        'delete',
        'are you sure you want to delete the post?',
        [
          {
            text: 'cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'delete', onPress: () => this.deletePost() },
        ],
        { cancelable: false },
      );
    }

    render() {
      //Once the delete button is clicked, create a popup confirmation modal to confirm deletion.
      //Once confirmed, delete the post using deletePost
      if (this.state.isLoading) {
        return (
          <View style={styles.activityContainer}>
            <ActivityIndicator size="large" color="#9E9E9E" />
          </View>
        );
      }
      if (this.state.deleteClicked) {
        return (
          <View />
        );
      }
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'left', alignItems: 'center' }}>

          <TouchableOpacity onPress={() => this.showDeletionAlert()}>

            <Ionicons name="md-trash" size={22} color="white" />

          </TouchableOpacity>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect(mapStateToProps)(DeleteComponent);
