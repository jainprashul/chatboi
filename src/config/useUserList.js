/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, useEffect } from "react";
import { FirebaseContext } from "../context/FirebaseContext";
import { AppString } from "./const";

let friendsListUnlistener = null;
let groupListUnlistener = null;
export function useUserList() {
    const firebase = useContext(FirebaseContext);
    const [onlineUsers, setOnlineUsers] = useState([])
    const [userList, setUserList] = useState([])
    // const [user, setUser] = useState({});
    const [searchList, setSearchList] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    const [groupsList, setGroupsList] = useState([]);
    const [usrGroupList, setUsrGroupList] = useState([]);
    const [loading, setLoading] = useState(false)


    let currentUser = {
        id: localStorage.getItem(AppString.ID),
        avatar: localStorage.getItem(AppString.PHOTO_URL),
        nickname: localStorage.getItem(AppString.NICKNAME),
    }

    useEffect(() => {
        userListOnInit()
    }, [])

    const userListOnInit = () => {
        if (friendsListUnlistener) {
            friendsListUnlistener()
        }
        setLoading(true)
        firebase.checkPresence(currentUser.id);

        
        Promise.all([getListUserAll(), getListGroupsAll()]).then(([users, groups]) => {
        Promise.all([getFriendsList(users), getGroupList(groups)])
        } )
        
        isOnlineData()
    }

    const isOnlineData = () => {
        firebase.rtDB.ref('status').on('value', (snapshot) => {
            // console.log(snapshot.val());
            let usersStatus = snapshot.val();
            let status = Object.entries(usersStatus);
            let onlineusers = status.filter(([userid, val]) => (val.connections));
            let onLineUserList = [];
            for (let s of onlineusers) {
                onLineUserList.push(s[0]);
            }
            // console.log(onLineUserList);
            setOnlineUsers(onLineUserList);
        })
    }

    const addFriend = (userUID) => {
        const timestamp = (Date.now())
        firebase.user(currentUser.id).collection('friends').doc(userUID).set({
            uid: userUID,
            lastMsgTime: timestamp

        }).then(res => {
            console.log('user added', res);
            firebase.user(userUID).collection('friends').doc(currentUser.id).set({
                uid: currentUser.id,
                lastMsgTime: timestamp
            })
        }).catch((err) => console.log(err)
        )
        // firebase.user(currentUser.id).update({
        //     friends: firebase.firestore.FieldValue.arrayUnion(userUID),
        //     isOnline: false
        // }).then(res => console.log(res)
        // ).catch(err=> console.log(err));
    }

    const removeFriend = (userUID) => {
        firebase.user(currentUser.id).collection('friends').doc(userUID).delete().then(res => {
            console.log('user removed', res);
        }).catch((err) => console.log(err)
        )
    }

    const removeGroup = (grpUID) => {
        firebase.user(currentUser.id).collection('groups').doc(grpUID).delete().then(res => {
            console.log('grp removed', res);
        }).catch((err) => console.log(err)
        )
        firebase.group(grpUID).collection('members').doc(currentUser.id).delete().then(res => {
            console.log('memeber removed', res);

        }).catch((err) => console.log(err));
    }

    const getFriendsList = async (users = userList) => {
        if (currentUser.id) {
            let flist = []
            // let res = await firebase.userFriends(currentUser.id).get();
            // let flist = res.docs.map(async (doc) => {
            //     let data = await doc.data()
            //     return data
            // });

            friendsListUnlistener = firebase.userFriends(currentUser.id).onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    let data = change.doc.data()
                    // console.log(data, type , change);
                    if (change.type === AppString.DOC_ADDED) {
                        flist.push(data);
                    } else if (change.type === AppString.DOC_MODIFIED) {                        
                        const i = flist.findIndex((f) => f.uid === data.uid);
                        flist[i] = data;
                    } else if (change.type === AppString.DOC_REMOVED) {
                        const i = flist.findIndex((f) => f.uid === data.uid);
                        flist.splice(i, 1)
                    }
                })

                let uidList = flist.map(f => f.uid)
                // console.log(uidList);
                setFriendsList(users.filter(user => {
                    let fr = flist.find(o => o.uid === user.id);
                    if (fr) {
                        user.lastMsgTime = fr.lastMsgTime;
                        user.lastMsg = fr.lastMsg;
                    }
                    // console.log(user , fr);

                    return uidList.includes(user.id)
                }).sort((a, b) => b.lastMsgTime - a.lastMsgTime)
                );
            });
            
        }
    }

    const getGroupList = async (groups = groupsList) => {
        if (currentUser.id) {
            let glist = []

            groupListUnlistener = firebase.userGroups(currentUser.id).onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    let data = change.doc.data()
                    // console.log(data, type , change);
                    if (change.type === AppString.DOC_ADDED) {
                        glist.push(data);
                    } else if (change.type === AppString.DOC_MODIFIED) {
                        const i = glist.findIndex((f) => f.uid === data.uid);
                        glist[i] = data;
                    } else if (change.type === AppString.DOC_REMOVED) {
                        const i = glist.findIndex((f) => f.uid === data.uid);
                        glist.splice(i, 1)
                    }
                })

                if (groups) {
                        let uidList = glist.map(f => f.uid)
                        // console.log(uidList);
                        let grpList = groups.filter(user => {
                            let fr = glist.find(o => o.uid === user.id);
                            if (fr) {
                                user.lastMsgTime = fr.lastMsgTime;
                                user.lastMsg = fr.lastMsg;
                            }
                            // console.log(user , fr);

                            return uidList.includes(user.id)
                        }).sort((a, b) => b.lastMsgTime - a.lastMsgTime);

                        setUsrGroupList(grpList);
                    }

                

            });
        }
    }


    async function searchUsers(query) {
        setLoading(true);
        console.log(query , userList);
        if (query) {
            let q = query.toLowerCase();
            let list = userList.filter((user => {
                return user.nickname.toLowerCase().startsWith(q);
            }))
            setSearchList(list)
            setTimeout(() => {
                setLoading(false)
            }, 800);
        } else {
            setSearchList([]);
            setLoading(false)
        }


    }

    /**
     * Get all User data List 
     */
    async function getListUserAll() {
        let usrList = [];
        const res = await firebase.getAllUsers();

        if (res.docs.length > 0) {
            res.docs.forEach(doc => {
                let data = doc.data();
                if (data.id !== currentUser.id) {
                    usrList.push(data);
                }

            });
            // console.log(usrList);
            setUserList(usrList);
            setLoading(false);

            return usrList
        }
    }

    async function getListGroupsAll() {
        let grpList = [];
        const res = await firebase.getAllGroups();

        if (res.docs.length > 0) {
            res.docs.forEach(doc => {
                let data = doc.data();
                if (data.id !== currentUser.id) {
                    grpList.push(data);
                }

            });
            // console.log(usrList);
            setGroupsList(grpList);
            setLoading(false);

            return grpList
        }
    }


    async function getUser(uid) {
        let res 
        if (uid.startsWith('G-')) {
            res = await firebase.getGroup(uid);
        } else {
            res = await firebase.getUser(uid);
        }
        
        if (res.docs.length > 0) {
            const userData = res.docs[0].data();
            userData && sessionStorage.setItem('peerUser', JSON.stringify(userData))
        }

        const user = JSON.parse(sessionStorage.getItem('peerUser'));
        return user
    }

    // function getUserData(uid) {
    //     getUser(uid).then(userD => {
    //         setUser(userD)
    //     })


    //     console.log(user);
    //     return user;
    // }

    return {
        loading,
        onlineUsers,
        userList,
        friendsList, groupsList, usrGroupList,
        chatList: [...friendsList, ...usrGroupList].sort((a, b) => b.lastMsgTime - a.lastMsgTime),
        getListUser: getListUserAll,
        currentUser,
        /**
         * Get userData , store & return it in the database 
         * @param {*} uid
         */
        getUser,
        addFriend,
        removeFriend,
        removeGroup,
        getFriendsList,
        searchList,
        searchUsers,
        userListOnInit
    }

}