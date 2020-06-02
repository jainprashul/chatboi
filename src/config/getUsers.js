import { useContext, useState, useEffect } from "react";
import { FirebaseContext } from "../context/FirebaseContext";
import { AppString } from "./const";

export function useUserList() {
    const firebase = useContext(FirebaseContext);
    const [onlineUsers, setOnlineUsers] = useState([])
    const [userList, setUserList] = useState([])
    const [loading, setLoading] = useState(false)


    let currentUser = {
        id: localStorage.getItem(AppString.ID),
        avatar: localStorage.getItem(AppString.PHOTO_URL),
        nickname: localStorage.getItem(AppString.NICKNAME),
    }

    useEffect(() => {
        setLoading(true)
        firebase.checkPresence(currentUser.id);
        getListUser()
        isOnlineData()
    }, [])

    const isOnlineData = () => {
        firebase.rtDB.ref('status').on('value', (snapshot) => {
            console.log(snapshot.val());
            let usersStatus = snapshot.val();
            let status = Object.entries(usersStatus);
            let onlineusers = status.filter(([userid, val]) => (val.connections));
            let onLineUserList = [];
            for (let s of onlineusers) {
                onLineUserList.push(s[0]);
            }
            console.log(onLineUserList);
            setOnlineUsers(onLineUserList);
        })
    }

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
        }
    }

    return {
        loading,
        onlineUsers,
        userList,
        getListUser,
        currentUser
    }
    
}