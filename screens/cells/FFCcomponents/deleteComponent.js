import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import Firebase from '../../../firebase'
import { clearUser } from '../../../redux/app-redux';
import { Ionicons } from '@expo/vector-icons';

const mapStateToProps = state => ({
  user: state.UserReducer.user,
});


class DeleteComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postID: this.props.postID,
      currentUserUID: Firebase.auth().currentUser.uid,
      deleteConfirmModal: false,
      isLoading: false,
      gain_loss: this.props.postType,
      postCount: 0,
    };
  }

    //----------------------------------------------------------
    //Delete the post from global and user post dbs. also decrement the post count by one>
    deletePost = async() => {
      this.setState({
        isLoading: true,
      });

      await Firebase.firestore()
        .collection('users')
        .doc(this.state.currentUserUID)
        .get()
        .then((doc) => {
            if (doc.exists) {
                this.setState ({
                    postCount: doc.data().postCount
                })
            } else {
                // doc.data() will be undefined in this case, so this wont even come up honestly
                console.log("No such document!");
            }
        });


      await Firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .delete()
        .catch((error) => {
            console.error("Error deleting ", error);
        })
        .then(() => this.reducePostCount());

      await Firebase.firestore()
        .collection(this.state.gain_loss)
        .doc(this.state.postID)
        .delete()
        .catch((error) => {
            console.error("Error deleting ", error);
        });

      await Firebase.firestore()
        .collection('comments')
        .doc(this.state.postID)
        .delete()
        .catch((error) => {
            console.error("Error deleting ", error);
        });

      await Firebase.firestore()
        .collection('likes')
        .doc(this.state.postID)
        .delete()
        .catch((error) => {
            console.error("Error deleting ", error);
        });

      await Firebase
        .storage()
        .ref(`screenshots/${this.state.currentUserUID}/${this.state.postID}`)
        .delete();
    }

    reducePostCount = async() => {
      await Firebase.firestore()
        .collection('users')
        .doc(this.state.currentUserUID)
        .set({
          postCount: this.state.postCount - 1,
        }, { merge: true })
        .then(() => this.setState({
            postCount: this.state.postCount - 1,
            isLoading: false,
          }),);
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
