import { useContext, useState } from "react";
import { FirebaseContext } from "../context/FirebaseContext";
import { AppString } from "./const";
import { createToast } from "./hooks";

export function useGroups() {
    const firebase = useContext(FirebaseContext);

    let currentUser = {
        id: localStorage.getItem(AppString.ID),
        photoUrl: localStorage.getItem(AppString.PHOTO_URL),
        nickname: localStorage.getItem(AppString.NICKNAME),
    }

    

    function addMember(member, gid) {
        firebase.group(gid).collection('members').doc(member.id).set(member)
            .then(res => {
                console.log(res);
                firebase.user(member.id).collection('groups').doc(gid).set({
                    uid: gid,
                    lastMsgTime: Date.now()
                })
                
            }).catch(err => console.log(err));
    }

    async function groupMembersList(gid) {
        

        let membersList = [];
        const res = await firebase.group(gid).collection('members').get();

        if (res.docs.length > 0) {
            res.docs.forEach(doc => {
                let data = doc.data();
                if (data.id !== currentUser.id) {
                    membersList.push(data);
                }

            });
        }
        console.log(membersList);
        
        return membersList
    }

    function removeMember(mid,gid) {
        firebase.user(mid).collection('groups').doc(gid).delete().then(res => {
            console.log('user removed', res);
        }).catch((err) => console.log(err)
        )

        firebase.group(gid).collection('members').doc(mid).delete().then(res => {
            console.log('memeber removed', res);
            
        }).catch((err) => console.log(err));
    }

    return {
        currentUser,
        addMember , removeMember, groupMembersList
    }
}