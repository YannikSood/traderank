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
exports.scheduledLeaderboardGainFunction = functions.pubsub.schedule('59 23 * * *')
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
    .then(() => {
        for (i = 0; i < sortedGainsUID.length; i++) {
            var currentUID = sortedGainsUID[i]
            console.log(currentUID)
            admin.firestore()
            .collection('users')
            .doc(currentUID)
            .get()
            .then(function(doc) {
                console.log(doc.exists)
                if (doc.data().pushStatus) {
                    console.log("push status true")
                    console.log(currentUID + " push status true, writing notification")
                        var messages = []
                        console.log(currentUID + " notification written, sending notification")
                        
                        messages.push({
                            "to": doc.data().token,
                            "sound": "default",
                            "title":"you got ranked!",
                            "body": "you made it on the gains leaderboard!"

                        });

                        fetch('https://exp.host/--/api/v2/push/send', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(messages)
                        });
                        return
                }
                return
            })
            .catch(error => {
                console.error("Error getting user push status etc: ", error);
            });

        }
        return null
    })
    
    return null

});

//Cloud function to perform loss leaderboard calculation
exports.scheduledLeaderboardLossFunction = functions.pubsub.schedule('59 23 * * *')
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
    .then(() => {

        for (i = 0; i < sortedLossesUID.length; i++) {
            var currentUID = sortedLossesUID[i]
            console.log(currentUID)
            admin.firestore()
            .collection('users')
            .doc(currentUID)
            .get()
            .then(function(doc) {
                console.log(doc.exists)
                if (doc.data().pushStatus) {
                    console.log("push status true")
                    console.log(currentUID + " push status true, writing notification")
                    var messages = []
                    console.log(currentUID + " notification written, sending notification")
                    
                    messages.push({
                        "to": doc.data().token,
                        "sound": "default",
                        "title":"you got ranked!",
                        "body": "you made it on the losses leaderboard!"

                    });

                    fetch('https://exp.host/--/api/v2/push/send', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(messages)
                    });
                    return
                }
                return
            })
            .catch(error => {
                console.error("Error getting user push status etc: ", error);
            });

        }
        return null
    })
    
    
    
    return null

});

//Function to write notifications to DB, and send push notifications
exports.writeNotification = functions.https.onCall((data, context) => {

    //Get the information of the user who is going to recieve the notification
    admin.firestore()
    .collection('users')
    .doc(data.recieverUID)
    .get()
    .then(function(doc) {
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
    .catch(function(error) {
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

//Function to send notifications for comment replies
exports.sendCommentReplyNotification = functions.https.onCall((data, context) => {

    //Get the information of the user who is going to recieve the notification
    admin.firestore()
    .collection('users')
    .doc(data.recieverUID)
    .get()
    .then(function(doc) {
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
    .catch(function(error) {
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





