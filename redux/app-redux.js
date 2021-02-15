import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

//
//Initial State
//

const initialUserState = {
    user: {
        id: 'tempID',
        username: 'tempUN',
        email: 'tempEMAIL'
    },
    isLoggedIn: false
}

const initalReplyState = {
    replyToUsername: ''
}
//
//Reducer
//
const userReducer = (state = initialUserState, action) => {
    switch(action.type) {
        case "authUser": 
            return {
                ...state,
                user: {
                    id: action.id,
                    username: action.username,
                    email: action.email
                },
                isLoggedIn: true
            }
        case "clearUser": 
            return {
                ...state,
                user: {
                    id: action.id,
                    username: action.username,
                    email: action.email
                },
                isLoggedIn: false
            }
        case "getUser": 
            return {
                ...state,
                user: {
                    id: id,
                    username: username,
                    email: email
                },
                isLoggedIn: true
            }
        default:
            return state;
    }
};

//reply reducer
const replyReducer = (state = initialReplyState , action) => {
    switch(action.type){
        case "setReply": 
            return {
                ...state,
                replyToUsername,
                isReplying:true
            }
        case "clearReply":
            return {
                ...state,
                replyToUsername,
                isReplying: false
            }
        case "getReply":
            return {
                ...state,
                isReplying: true
            }
        default: 
            return state;


    }
};

//
//Action
//
const authUser = (userid, userEmail, username) => {
    return {
        type: 'authUser',
        id: userid,
        username: username,
        email: userEmail

    }
};

const getUser = () => {
    return {
        type: 'getUser',
        id: userid,
        username: username,
        email: userEmail

    }
};

const clearUser = (temp) => {
    return {
        type: 'clearUser',
        id: temp,
        username: temp,
        email: temp
    }
};

//Replying to comments 
const setReply = (username) => {
    return {
        type: 'setReply',
        replyToUsername: username
    }
};

const clearReply = (temp) => {
    return {
        type: 'clearReply',
        replyToUsername: temp
    }
};

const getReply = () => {
    return {
        type: 'getReply',
        replyToUsername: username
    }
};

//
//Store
//
const store = createStore(userReducer, applyMiddleware(thunkMiddleware));
export { store };
export { authUser };
export { getUser };
export { clearUser };

//Reply
const replyStore = createStore(replyReducer, applyMiddleware(thunkMiddleware));
export { replyStore };
export { setReply };
export { getReply };
export { clearReply };