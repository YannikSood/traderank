// 1) User sees a reply button
// 2) User presses reply button, input box (comment component) autofills with replyee @username 
// 3) User writes reply, we write to comments db under the comment ID as a collection and send replyee notification
// 4) We show the comment under the original comment in a flatlist