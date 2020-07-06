import React, { useContext, useState } from 'react'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonItem, IonCheckbox, IonAvatar, IonLabel, IonButtons, IonBackButton, IonContent, IonFab, IonFabButton, IonIcon } from '@ionic/react'
import { FirebaseContext } from '../context/FirebaseContext';
import { useGroups } from '../config/useGroups';
import { useUserList } from '../config/useUserList';
import { arrowForwardOutline } from 'ionicons/icons';
import { createToast } from '../config/hooks';
import { ROUTE } from '../config/const';


const AddToGroup = ( {history} ) => {
    const grp = JSON.parse(sessionStorage.getItem('peerUser'));
    // const firebase = useContext(FirebaseContext);
    const { groupMembersList, addMember } = useGroups();
    const { friendsList } = useUserList();
    const [groupMembers, setGroupMembers] = useState([])

    const [members, setmembers] = useState(async () => {
        groupMembersList(grp.id).then(list => {
            setmembers(list)
        })
    })

    function addMembers() {
        
            groupMembers.forEach((member) => {
                delete member.lastMsg
                addMember(member, grp.id)
            createToast('User added.')
            history.replace(ROUTE.chat + '?userid=' + grp.id)
        })
    }

    // console.log(grp, members);
    const membersId = () => {
        let arr = [];
        members.forEach((user) => {
            arr.push(user.id);
        })
        return arr;
    }
    


    const ListUser = () => friendsList.map(user => {
        delete user.lastMsg
        
        // console.log(members, user);
        
        if (membersId().includes(user.id, 0)) {
            user.checked = true;
            user.already = true;
        }
        return (
            <IonItem  key={user.id}>
                <IonCheckbox slot='end' disabled={user.already} checked={user.checked} color='secondary' onIonChange={e => {
                    if (e.detail.checked) {
                        groupMembers.push(user)
                        user.checked = true
                    } else {
                        groupMembers.pop()
                        user.checked = false

                    }

                    console.log(groupMembers);

                }} />
                <IonAvatar slot='start'>
                    <img src={user.photoUrl} alt="avatar" />
                </IonAvatar>
                <IonLabel>{user.nickname}</IonLabel>
            </IonItem>
        )
    })
    
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonBackButton/>
                    </IonButtons>
                    <IonTitle>Add to {grp.nickname}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className='ion-padding'>
                <ListUser />
                <IonFab vertical='bottom' horizontal='end' slot='fixed'>
                    <IonFabButton color='success' fill='clear' onClick={() => { addMembers() }}>
                        <IonIcon icon={arrowForwardOutline} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    )
}

export default AddToGroup
