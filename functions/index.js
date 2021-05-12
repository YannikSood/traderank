const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const algoliasearch = require('algoliasearch');

const client = algoliasearch('5BS4R91W97', '1dd2a5427b3daed5059c1dc62bdd2197');
const index = client.initIndex('usernames');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

//When a new user is created in the users collection in database, we can do something
//This can apply to follow, following, posts, rankings, all for push notifications
// exports.onUserCreate = functions.firestore.document('users/{userId}').onCreate(async (snap, context) => {
//     const values = snap.data();

//     //When a new user is added to users collection, add the username to the db if it isnt already there etc.
//     await db.collection('usernames').doc(values.username).set({ uid: values.uid });
// })

//Automatically run the leaderboard here

//Automatically do push notifications here
//We need a notifications table, device table, fcm, notifications package
//Review trigger path: https://zainmanji.medium.com/how-to-structure-firebase-push-notifications-in-your-react-native-app-6847712d1c31
//Fetch the notifications for a user from their notifications table
//Update device info in device table on logout/login/deletion

//Cloud function to perform gains leaderboard calculation
exports.scheduledLeaderboardGainFunction = functions.pubsub.schedule('58 23 * * *')
  .timeZone('America/New_York') 
  .onRun(async (context) => {

    const globalPostsArray = []
    const gainsUID = []
    var sortedGainsUID = []

    await admin.firestore().collection('gain').orderBy("date_created", "desc")
    .get()
    .then((querySnapshot) => {

        if(querySnapshot) {
    
            querySnapshot.forEach((res) => {
        
            const { 
                username,
                description,
                uid,
                ticker,
                image,
                gain_loss,
                date_created,
                likesCount,
                profit_loss,
                percent_gain_loss,
                security,
                postID,
                score,
                postType
                } = res.data();
        
                globalPostsArray.push({
                    key: res.id,
                    username,
                    description,
                    uid,
                    ticker,
                    image,
                    gain_loss,
                    date_created,
                    likesCount,
                    profit_loss,
                    percent_gain_loss,
                    security,
                    postID,
                    score,
                    postType
                });

                gainsUID.push(uid)

            });

            // console.log(globalPostsArray)
        }
        else {
            throw new Error("Data doesn't exist")
        }
        return null
    })
    .then(() => {
        var today = new Date();
        console.log(today)
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var newToday = mm + dd + yyyy;
        sortedGainsUID = [...new Set(gainsUID)]

        if (globalPostsArray.length > 0) {
            for (i = 0; i < globalPostsArray.length; i++) {
                
                globalPostsArray[i].score = parseInt(globalPostsArray[i].profit_loss) + parseInt(globalPostsArray[i].percent_gain_loss)

                admin.firestore()
                .collection('leaderboard')
                .doc(newToday)
                .collection("gains")
                .doc(globalPostsArray[i].postID)
                .set ({
                    username: globalPostsArray[i].username,
                    description: globalPostsArray[i].description,
                    uid: globalPostsArray[i].uid,
                    ticker: globalPostsArray[i].ticker,
                    image: globalPostsArray[i].image,
                    gain_loss: globalPostsArray[i].gain_loss,
                    date_created: globalPostsArray[i].date_created,
                    likesCount: globalPostsArray[i].likesCount,
                    profit_loss: globalPostsArray[i].profit_loss,
                    percent_gain_loss: globalPostsArray[i].percent_gain_loss,
                    security: globalPostsArray[i].security,
                    postID: globalPostsArray[i].postID,
                    score: globalPostsArray[i].score,
                    postType: 1
                })
                .catch(error => {
                    console.error("Error writing document to global posts: ", error);
                });
            }
        }
        else {
            throw new Error("length not greater than 0")
        }
        return null;
    })
    // .then(() => {
    //     for (i = 0; i < sortedGainsUID.length; i++) {
    //         var currentUID = sortedGainsUID[i]
    //         console.log(currentUID)
    //         admin.firestore()
    //         .collection('users')
    //         .doc(currentUID)
    //         .get()
    //         .then((doc) => {
    //             console.log(doc.exists)
    //             if (doc.data().pushStatus) {
    //                 console.log("push status true")
    //                 console.log(currentUID + " push status true, writing notification")
    //                     var messages = []
    //                     console.log(currentUID + " notification written, sending notification")
                        
    //                     messages.push({
    //                         "to": doc.data().token,
    //                         "sound": "default",
    //                         "title":"you got ranked!",
    //                         "body": "you made it on the gains leaderboard!"

    //                     });

    //                     fetch('https://exp.host/--/api/v2/push/send', {
    //                         method: 'POST',
    //                         headers: {
    //                             'Accept': 'application/json',
    //                             'Content-Type': 'application/json',
    //                         },
    //                         body: JSON.stringify(messages)
    //                     });
    //                     return
    //             }
    //             return
    //         })
    //         .catch(error => {
    //             console.error("Error getting user push status etc: ", error);
    //         });

    //     }
    //     return null
    // })
    
    return null

});

//Cloud function to perform loss leaderboard calculation
exports.scheduledLeaderboardLossFunction = functions.pubsub.schedule('58 23 * * *')
  .timeZone('America/New_York') 
  .onRun(async (context) => {

    const globalPostsArray = []
    const lossesUID = []
    var sortedLossesUID = []

    await admin.firestore().collection('loss').orderBy("date_created", "desc")
    .get()
    .then((querySnapshot) => {

        if(querySnapshot) {
    
            querySnapshot.forEach((res) => {
        
            const { 
                username,
                description,
                uid,
                ticker,
                image,
                gain_loss,
                date_created,
                likesCount,
                profit_loss,
                percent_gain_loss,
                security,
                postID,
                score,
                postType
                } = res.data();
        
                globalPostsArray.push({
                    key: res.id,
                    username,
                    description,
                    uid,
                    ticker,
                    image,
                    gain_loss,
                    date_created,
                    likesCount,
                    profit_loss,
                    percent_gain_loss,
                    security,
                    postID,
                    score,
                    postType
                });


                lossesUID.push(uid)

            });

            // console.log(globalPostsArray)
        }
        else {
            throw new Error("Data doesn't exist")
        }
        return null
    })
    .then(() => {
        var today = new Date()
        console.log(today)
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var newToday = mm + dd + yyyy;
        sortedLossesUID = [...new Set(lossesUID)]

        if (globalPostsArray.length > 0) {
            for (i = 0; i < globalPostsArray.length; i++) {
                
                globalPostsArray[i].score = parseInt(globalPostsArray[i].profit_loss) + parseInt(globalPostsArray[i].percent_gain_loss)

                admin.firestore()
                .collection('leaderboard')
                .doc(newToday)
                .collection("losses")
                .doc(globalPostsArray[i].postID)
                .set ({
                    username: globalPostsArray[i].username,
                    description: globalPostsArray[i].description,
                    uid: globalPostsArray[i].uid,
                    ticker: globalPostsArray[i].ticker,
                    image: globalPostsArray[i].image,
                    gain_loss: globalPostsArray[i].gain_loss,
                    date_created: globalPostsArray[i].date_created,
                    likesCount: globalPostsArray[i].likesCount,
                    profit_loss: globalPostsArray[i].profit_loss,
                    percent_gain_loss: globalPostsArray[i].percent_gain_loss,
                    security: globalPostsArray[i].security,
                    postID: globalPostsArray[i].postID,
                    score: globalPostsArray[i].score,
                    postType: 1
                })
                .catch(error => {
                    console.error("Error writing document to global posts: ", error);
                });
            }
        }
        else {
            throw new Error("length not greater than 0")
        }
        return null;
    })
    // .then(() => {

    //     for (i = 0; i < sortedLossesUID.length; i++) {
    //         var currentUID = sortedLossesUID[i]
    //         console.log(currentUID)
    //         admin.firestore()
    //         .collection('users')
    //         .doc(currentUID)
    //         .get()
    //         .then((doc) => {
    //             console.log(doc.exists)
    //             if (doc.data().pushStatus) {
    //                 console.log("push status true")
    //                 console.log(currentUID + " push status true, writing notification")
    //                 var messages = []
    //                 console.log(currentUID + " notification written, sending notification")
                    
    //                 messages.push({
    //                     "to": doc.data().token,
    //                     "sound": "default",
    //                     "title":"you got ranked!",
    //                     "body": "you made it on the losses leaderboard!"

    //                 });

    //                 fetch('https://exp.host/--/api/v2/push/send', {
    //                     method: 'POST',
    //                     headers: {
    //                         'Accept': 'application/json',
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify(messages)
    //                 });
    //                 return
    //             }
    //             return
    //         })
    //         .catch(error => {
    //             console.error("Error getting user push status etc: ", error);
    //         });

    //     }
    //     return null
    // })
    
    
    
    return null

});

exports.scheduledRankingNotification = functions.pubsub.schedule('58 23 * * *')
  .timeZone('America/New_York') 
  .onRun(async (context) => {

    admin.firestore()
    .collection('users')
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().pushStatus) {
                var messages = []

                messages.push({
                    "to": doc.data().token,
                    "sound": "default",
                    "title":"🏆",
                    "body": "daily rankings are updated!"
                });

                //Post it to expo
                
                fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(messages)
                });

                return (
                    "notification written"
                )
            }
            
        })
        return null
    })
    .catch((error) => {
        console.error("Error finding user: ", error);
    });

    return (
        true
    )
    
}); 

//Function to write notifications to DB, and send push notifications
exports.writeNotification = functions.https.onCall((data, context) => {

    //Get the information of the user who is going to recieve the notification
    admin.firestore()
    .collection('users')
    .doc(data.recieverUID)
    .get()
    .then((doc) => {
        if (doc.exists) {
            //Find out if the user will accept push notifications
            if (doc.data().pushStatus) {

                var messages = []

                //Write the notification and add it to messages

                if (data.type === 0) {
                    messages.push({
                        "to": doc.data().token,
                        "sound": "default",
                        "title":"you got a like!",
                        "body": data.senderUsername + " liked your post!"
                    });
    
                    //Post it to expo
                    
                    fetch('https://exp.host/--/api/v2/push/send', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(messages)
                    });
                }
                else if (data.type === 1) {
                    messages.push({
                        "to": doc.data().token,
                        "sound": "default",
                        "title":"you got a comment!",
                        "body": data.senderUsername + " commented on your post!"
                    });
    
                    //Post it to expo
                    
                    fetch('https://exp.host/--/api/v2/push/send', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(messages)
                    });
                }
                else if (data.type === 2) {
                    messages.push({
                        "to": doc.data().token,
                        "sound": "default",
                        "title":"you got a new follower!",
                        "body": data.senderUsername + " followed you!"
                    });
    
                    //Post it to expo
                    
                    fetch('https://exp.host/--/api/v2/push/send', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(messages)
                    });
                }
                else if (data.type === 3) {
                    messages.push({
                        "to": doc.data().token,
                        "sound": "default",
                        "title":"your comment got a like!",
                        "body": data.senderUsername + " liked your comment!"
                    });
    
                    //Post it to expo
                    
                    fetch('https://exp.host/--/api/v2/push/send', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(messages)
                    });
                }

                return (
                    "notification written"
                )
            }
            else {
                console.log("doesnt accept push notifications: " + doc.data().username)
                return
            }
        } else {
            // doc.data() will be undefined in this case, so this wont even come up honestly
            console.log("No such document!");
            return
        }
    })
    .catch((error) => {
        console.error("Error finding user: ", error);
    });

    admin.firestore()
    .collection('users')
    .doc(data.recieverUID)
    .set({ hasNotifications: true }, {merge: true})

    return (
        true
    )
});


exports.sendUserAlertsNotication = functions.https.onCall((data, context) => {

    //data.posterUID
    //data.posterUsername
    //data.postType

    admin.firestore()
    .collection('users')
    .doc(data.posterUID) //
    .collection('UsersToAlert')
    .get()
    .then((querySnapshot) => {
        console.log("within the users to alert")
        querySnapshot.forEach((doc) => {
            console.log(doc.data().uid)
            admin.firestore()
            .collection('users')
            .doc(doc.data().uid)
            .get()
            .then((gotUser) => {
                console.log("within the users information")
                if (gotUser.exists) {
            //Find out if the user will accept push notifications
                    if (gotUser.data().pushStatus) {
                        var messages = []

                        // console.log("within the users to alert")
                        messages.push({
                            "to": gotUser.data().token,
                            "sound": "default",
                            "title": "traderank",
                            "body": data.posterUsername + " just posted a " + data.postType + "!"
                        });

                        //Post it to expo
                        
                        fetch('https://exp.host/--/api/v2/push/send', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(messages)
                        });

                        return (
                            "notification written"
                        )
                    }
                }
                return (
                    "notification written"
                )
            })
            .catch((error) => {
                console.error("Error finding user: ", error);
            });
        })

        return null
    })
    .catch((error) => {
        console.error("Error finding user: ", error);
    });

    return (
        true
    )


})


//Function to send notifications for comment replies
exports.sendCommentReplyNotification = functions.https.onCall((data, context) => {

    //Get the information of the user who is going to recieve the notification
    admin.firestore()
    .collection('users')
    .doc(data.recieverUID)
    .get()
    .then((doc) => {
        if (doc.exists) {
            //Find out if the user will accept push notifications
            if (doc.data().pushStatus) {

                var messages = []

                //Write the notification and add it to messages

                messages.push({
                    "to": doc.data().token,
                    "sound": "default",
                    "title":"you got a reply!",
                    "body": data.senderUsername + " replied to your comment!"
                });

                //Post it to expo
                
                fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(messages)
                });
                
                return (
                    "notification written"
                )
            }
            else {
                console.log("doesnt accept push notifications: " + doc.data().username)
                return
            }
        } else {
            // doc.data() will be undefined in this case, so this wont even come up honestly
            console.log("No such document!");
            return
        }
    })
    .catch((error) => {
        console.error("Error finding user: ", error);
    });

    admin.firestore()
    .collection('users')
    .doc(data.recieverUID)
    .set({ hasNotifications: true }, {merge: true})

    return (
        true
    )
});

//Function to add new user to algolio 
exports.addUserToAlgolia = functions.https.onCall((data, context) => {
    // admin.firestore()
    // .collection('usernames')
    // .doc(data.username)
    // .get()
    // .then(function(doc) {
    //     if(doc.exists){

    //     } else{
    //         console.log("No such document!");
    //         return
    //     }
    // }).catch(function(error){
    //     console.error("Error finding user: ", error);
    // })
    const record = {
        "username": data.username,
        "objectID": data.uid,
        "uid": data.uid
    };

    index
        .saveObject(record)
        .then(() => {
            console.log('Firebase object indexed in Algolia', data.username);
            return
        })
        .catch(err => {
            console.log('Error when indexing contact into Algolia', err);
        })

});


// //Function to send notifications for comment replies
// exports.sendChatNotifications = functions.https.onCall((data, context) => {

//     admin.firestore()
//     .collection('users')
//     // .where("pushStatus", "==", true)
//     // .where("uid", "!=", data.senderUID )
//     .doc("JGIu18iWPof1IOYlJYpcRiBbkiE2")
//     .get()
//     .then((querySnapshot) => {
//         // querySnapshot.forEach((doc) => {
//             var messages = []

//             //Write the notification and add it to messages

//             messages.push({
//                 "to": querySnapshot.data().token,
//                 "sound": "default",
//                 "title":"you have a message!",
//                 "body": "go to " + data.roomName
//             });

//             //Post it to expo
            
//             fetch('https://exp.host/--/api/v2/push/send', {
//                 method: 'POST',
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(messages)
//             });
            
            

//             //Set has chat notifications to true
//             admin.firestore()
//             .collection('users')
//             // .doc(doc.data().uid)
//             .doc(querySnapshot.id)
//             .set({ hasChatNotifications: true }, {merge: true})

//             //Create a new collection and add it
//             admin.firestore()
//             .collection('users')
//             // .doc(doc.data().uid)
//             .doc(querySnapshot.id)
//             .collection("chatNotifications")
//             .doc(data.roomName)
//             .set({ hasChatNotifications: true }, {merge: true})

//             return (
//                 "notification written"
//             )
            
//         // })
//     })
//     .catch(function(error) {
//         console.error("Error finding user: ", error);
//     });

//     return (
//         true
//     )
// });

/**
 * Promise template
 * return new Promise((resolve, reject) => { 
 *  admin.firestore()
 *  ...
 *  ...
 *  ...
 * let hash = {
 *  //data from db 
 * }
 * resolve(hash);
 * return null;
 * }).catch(err => {
 *   console.log(err);
 *   reject(err);
 * })
 * 
 */

exports.pullUserInfo = functions.https.onCall((data, context) => {
    return new Promise((resolve, reject) => {
        admin.firestore()
        .collection('users')
        .doc(data.userUID)
        .get()
        .then((doc) => {
          let hash = {
            postCount: doc.data().postCount,
            followerCount: doc.data().followerCount,
            followingCount: doc.data().followingCount,
            storage_image_uri: doc.data().profilePic,
            bio: doc.data().bio,
            dateJoined: doc.data().signupDate.toDate(),
            twitter: doc.data().twitter,
            instagram: doc.data().instagram,
            isLoading: false,
          };
          console.log("Hash from pullUserInfo: " + JSON.stringify(hash));
          resolve(hash);
          return null;
        }).catch(err => {
            console.log("Error from pullUserInfo: " + err);
            reject(err);
        })
    });

});

exports.getPosterInfo = functions.https.onCall((data, context) => {
    
    return new Promise((resolve, reject) => {
        admin.firestore()
        .collection('users')
        .doc(data.posterUID)
        .onSnapshot((doc) => {
            let hash = {
                posterUsername: doc.data().username,
                posterFollowerCount: doc.data().followerCount,
                posterFollowingCount: doc.data().followingCount,
                posterPostCount: doc.data().postCount,
                posterBio: doc.data().bio,
                storage_image_uri: doc.data().profilePic,
                dateJoined: doc.data().signupDate,
                posterTwitter: doc.data().twitter,
                posterInstagram: doc.data().instagram,
                isLoading: false,
            };
            resolve(hash);
            return null;
        })
    }).catch(err => {
        console.log(`Error from getPosterInfo ${err}`);
        reject(err);
    })


});

exports.getGainsCollection = functions.https.onCall((data, context) => {

    return new Promise((resolve, reject) => {
        const leaderboardGains = [];
        let index = 1;

        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const newToday = mm + dd + yyyy;

        admin.firestore().collection('leaderboard').doc(newToday).collection('gains')
        .orderBy('score', 'desc')
        .limit(6)
        .get()
        .then((query) => {
          query.forEach((res) => {
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
              date_created,
              score,
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
              date_created,
              score,
            });

            index++;
          });
    })
});

exports.getUserNumbers = functions.https.onCall((data, context) => {

    return new Promise((resolve, reject) => {

        admin.firestore()
        .collection('users')
        .doc(data.currentUserUID)
        .get()
        .then((doc) => {
              
            let hash = {
                currentUserUsername: doc.data().username,
                currentFollowerCount: doc.data().followerCount,
                currentFollowingCount: doc.data().followingCount,
            };
            
            resolve(hash);
            return null;
        }).catch(err => {
            console.log(`Error from getUserNumbers ${err}`);
            reject(err);
        })

    });


});

exports.checkIsFollowing = functions.https.onCall((data, context) => {

    return new Promise((resolve, reject) => {

        admin.firestore()
        .collection('following')
        .doc(data.currentUserUID)
        .collection('following')
        .doc(data.posterUID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            let hash = {
              isFollowing: true,
            };
            resolve(hash);
            return null;
          } else {
            let hash = {
              isFollowing: false,
            };
            resolve(hash);
            return null;
          }
        }).catch(err => {
            console.log(`Error when checking if current user is following clicked user: ${err}`);
            reject(err);
        })

    });


});

exports.checkHasAlerts = functions.https.onCall((data, context) => {

    return new Promise((resolve, reject) => {

        admin.firestore()
        .collection('users')
        .doc(data.posterUID)
        .collection('UsersToAlert')
        .doc(data.currentUserUID)
        .get()
        .then((doc) => {
            if (doc.exists) {
            let hash = {
                hasAlerts: true,
            };
            resolve(hash);
            return null;
            } else {
            let hash = {
                hasAlerts: false,
            };
            resolve(hash);
            return null;
            }
          
        }).catch(err => {
            console.log(`Error when checking if current user is following clicked user: ${err}`);
            reject(err);
        })

    });


});

exports.followUser = functions.https.onCall((data, context) => {

    return new Promise((resolve, reject) => {
        admin.firestore()
        .collection('following')
        .doc(data.currentUserUID)
        .collection('following')
        .doc(data.posterUID)
        .set({
            uid: data.posterUID,
        })
        .catch(err => {
            console.log(`Error when updating current following DB: ${err}`);
        })

        //The poster now has the current user as a follower
        admin.firestore()
        .collection('followers')
        .doc(data.posterUID)
        .collection('followers')
        .doc(data.currentUserUID)
        .set({
            uid: data.currentUserUID,
        })
        .catch(err => {
            console.log(`Error when updating poster follower DB: ${err}`);
        })

        //Update the following count for the current user
        admin.firestore()
        .collection('users')
        .doc(data.currentUserUID)
        .set({
            followingCount: data.currentFollowingCount + 1,
        }, { merge: true })
        .catch(err => {
            console.log(`Error when updating current following COUNT: ${err}`);
        })


        //Update the follower count for the clicked user
        admin.firestore()
        .collection('users')
        .doc(data.posterUID)
        .set({
            followerCount: data.posterFollowerCount + 1,
        }, { merge: true })
        .then(() => {
            let hash = {
                currentFollowingCount: data.currentFollowingCount + 1,
                posterFollowerCount: data.posterFollowerCount + 1
            };
            resolve(hash);
            return null;
        })
        .catch(err => {
            console.log(`Error when updating clicked follower COUNT: ${err}`);
            reject(err);
        })

    });


});

exports.unfollowUser = functions.https.onCall((data, context) => {

    return new Promise((resolve, reject) => {
        admin.firestore()
        .collection('following')
        .doc(data.currentUserUID)
        .collection('following')
        .doc(data.posterUID)
        .delete()
        .catch(err => {
            console.log(`Error when deleting from current following DB: ${err}`);
        })

        //The poster now has the current user as a follower
        admin.firestore()
        .collection('followers')
        .doc(data.posterUID)
        .collection('followers')
        .doc(data.currentUserUID)
        .delete()
        .catch(err => {
            console.log(`Error when deleting from poster follower DB: ${err}`);
        })

        //Update the following count for the current user
        admin.firestore()
        .collection('users')
        .doc(data.currentUserUID)
        .set({
            followingCount: data.currentFollowingCount - 1,
        }, { merge: true })
        .catch(err => {
            console.log(`Error when updating current following COUNT: ${err}`);
        })


        //Update the follower count for the clicked user
        admin.firestore()
        .collection('users')
        .doc(data.posterUID)
        .set({
            followerCount: data.posterFollowerCount - 1,
        }, { merge: true })
        .then(() => {
            let hash = {
                currentFollowingCount: data.currentFollowingCount - 1,
                posterFollowerCount: data.posterFollowerCount - 1
            };
            resolve(hash);
            return null;
        })
        .catch(err => {
            console.log(`Error when updating clicked follower COUNT: ${err}`);
            reject(err);
        })

    });


});

exports.addUserToAlerts = functions.https.onCall((data, context) => {

    return new Promise((resolve, reject) => {

        admin.firestore()
        .collection('users')
        .doc(data.posterUID)
        .collection('UsersToAlert')
        .doc(data.currentUserUID)
        .set({
          uid: data.currentUserUID,
        })
        .then(() => {
            let hash = {
                hasAlerts: true
            };
            resolve(hash);
            return null;
        }).catch(err => {
            console.log(`Error when checking if current user is following clicked user: ${err}`);
            reject(err);
        })

    });


});

exports.removeUserFromAlerts = functions.https.onCall((data, context) => {

    return new Promise((resolve, reject) => {

        admin.firestore()
        .collection('users')
        .doc(data.posterUID)
        .collection('UsersToAlert')
        .doc(data.currentUserUID)
        .delete()
        .then(() => {
            let hash = {
                hasAlerts: false
            };
            resolve(hash);
            return null;
        }).catch(err => {
            console.log(`Error when checking if current user is following clicked user: ${err}`);
            reject(err);
        })

    });


});


exports.sendMentionsNotification = functions.https.onCall((data, context) => {

    //RecieverUID, senderUsername, Roomname
    admin.firestore()
    .collection('users')
    .doc(data.recieverUID)
    .get()
    .then((doc) => {
        if (doc.exists) {
            //Find out if the user will accept push notifications
            if (doc.data().pushStatus) {

                var messages = []

                messages.push({
                    "to": doc.data().token,
                    "sound": "default",
                    "title":"Hey!",
                    "body": data.senderUsername + " mentioned you in " + data.roomName
                });

                //Post it to expo
                
                fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(messages)
                });

                admin.firestore()
                .collection('users')
                .doc(data.recieverUID)
                .set({ hasChatNotifications: true }, {merge: true})

                admin.firestore()
                .collection('users')
                .doc(data.recieverUID)
                .collection("chatNotifications")
                .doc(data.roomName)
                .set({ hasChatNotifications: true }, {merge: true})
            }

            return (
                "notification written"
            )
        }
        else {
            // doc.data() will be undefined in this case, so this wont even come up honestly
            console.log("No such document!");
            return
        }
    })
    .catch((error) => {
        console.error("Error finding user: ", error);
    });
});