export const ROUTE = {
    signin: '/signin',
    chat: '/chat',
    profile: '/profile',
    users: '/users',
    startScreen: '/screen',
    theme: '/chat/theme',
    feed: '/feed',
    settings: '/settings',
    groups: '/createGroup',
    chatDetails: '/chat/details',
    addToGroup: '/user/groupEdit',
    videoChat: '/video/:id'
}

export const user = require('../images/user.jpg');

export const ting = require('../images/ting.mp3')

export const AppString = {
    ID: 'id',
    PHOTO_URL: 'photoUrl',
    NICKNAME: 'nickname',
    ABOUT_ME: 'aboutMe',
    MESSAGES: 'messages',
    GROUPS : 'groups',
    USERS: 'users',
    UPLOAD_CHANGED: 'state_changed',
    DOC_ADDED: 'added',
    DOC_MODIFIED: 'modified',
    DOC_REMOVED: 'removed',
    PREFIX_IMAGE: 'image/',
    CHATBOX_SHARED: '/chatboxShared',
    USER_PROFILE_IMAGE: '/profile',
    APP_NAME : 'Chat Boi'
}

export const logo = require('../images/logo.png')

export const images = {
    heart : require('../images/heart.gif'),
    mimi1 : require('../images/mimi1.gif'),
    mimi2 : require('../images/mimi2.gif'),
    mimi3 : require('../images/mimi3.gif'),
    mimi4 : require('../images/mimi4.gif'),
    mimi5 : require('../images/mimi5.gif'),
    mimi6 : require('../images/mimi6.gif'),
    mimi7 : require('../images/mimi7.gif'),
    mimi8 : require('../images/mimi8.gif'),
    mimi9 : require('../images/mimi9.gif'),
}

export const themes = [
    'default','SexyBlue', 'CheeryBlossom', 'PureLust', 'UnderTheLake'
]

export const requestOptions = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
}

