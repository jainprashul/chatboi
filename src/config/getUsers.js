import { useContext, useState, useEffect } from "react";
import { FirebaseContext } from "../context/FirebaseContext";
import { AppString } from "./const";

export function useUserList() {
    const firebase = useContext(FirebaseContext);
    const [onlineUsers, setOnlineUsers] = useState([])
    const [userList, setUserList] = useState([])
    // const [user, setUser] = useState({});
    const [searchList, setSearchList] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    const [loading, setLoading] = useState(false)


    let currentUser = {
        id: localStorage.getItem(AppString.ID),
        avatar: localStorage.getItem(AppString.PHOTO_URL),
        nickname: localStorage.getItem(AppString.NICKNAME),
    }

    useEffect(() => {
        setLoading(true)
        firebase.checkPresence(currentUser.id);
        getListUser().then(users => {
            getFriendsList(users);
            // setSearchList(users)
        });
        isOnlineData()


    }, [])

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
        firebase.user(currentUser.id).collection('friends').doc(userUID).set({
            uid: userUID
        }).then(res => {
            console.log('user added', res);

        }).catch((err) => console.log(err)
        )
        // firebase.user(currentUser.id).update({
        //     friends: firebase.firestore.FieldValue.arrayUnion(userUID),
        //     isOnline: false
        // }).then(res => console.log(res)
        // ).catch(err=> console.log(err));
    }

    const getFriendsList = async (users = userList) => {
        if (currentUser.id) {
            let res = await firebase.userFriends(currentUser.id).get();
            let flist = res.docs.map(doc => doc.id);
            console.log(flist);
            // console.log(userList);
            // return userList.filter(user => friends.includes(user.id));
            setFriendsList(users.filter(user => flist.includes(user.id)));
        }
    }

    async function searchUsers(query) {
        setLoading(true);
        if (query) {
            let q = query.toLowerCase();
            let list = userList.filter((user => {
                return user.nickname.toLowerCase().indexOf(q) > -1;
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
    async function getListUser() {
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


    async function getUser(uid) {
        const res = await firebase.getUser(uid);
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
        friendsList,
        getListUser,
        currentUser,
        /**
         * Get userData , store & return it in the database 
         * @param {*} uid
         */
        getUser,
        addFriend,
        getFriendsList,
        searchList,
        searchUsers
    }

}