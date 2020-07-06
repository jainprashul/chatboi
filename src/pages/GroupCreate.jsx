import React, { useState, useContext } from 'react'
import { IonPage, IonToolbar, IonHeader, IonTitle, IonContent, IonButtons, IonBackButton, IonList, IonListHeader, IonItem, IonLabel, IonCheckbox, IonAvatar, IonFab, IonFabButton, IonIcon, IonInput, IonItemDivider, IonLoading } from '@ionic/react'
import { useUserList } from '../config/useUserList'
import { arrowForwardOutline, arrowBackOutline } from 'ionicons/icons';
import { FirebaseContext } from '../context/FirebaseContext';
import { createToast } from '../config/hooks';
import { useGroups } from '../config/useGroups';
import { ROUTE } from '../config/const';
import withAuthorization from '../context/withAuthorization';


// let groupMembers = [];
const GroupCreate = ({history}) => {
    
    const firebase = useContext(FirebaseContext);
    const { friendsList } = useUserList();
    const [AddSubject, setAddSubject] = useState(false)
    const [groupMembers, setGroupMembers] = useState([])
    const [grpName, setGrpName] = useState('')
    const [showLoading, setShowLoading] = useState(false);

    const { currentUser, addMember, removeMember } = useGroups()

    function generateGroup() {

        if (!grpName.trim().length) {
            createToast("Group name can't be empty");
            return;
        }

        setShowLoading(true);

        
        groupMembers.push(currentUser)
        const grp = {
            id: `G-${Date.now()}`,
            nickname: grpName,
            dateCreated: Date.now(),
            createdBy: currentUser,
            photoUrl: 'https://image.flaticon.com/icons/svg/1527/1527844.svg'
        }

        firebase.group(grp.id).set(grp).then(res => {
            groupMembers.forEach((member) => {
                delete member.lastMsg
                addMember(member,grp.id)
            })
            createToast('Group created.')
            history.replace(ROUTE.chat + '?userid=' + grp.id)
        })



    }
    

    const ListUser = () => friendsList.map(user => (
        <IonItem key={user.id}>
            <IonCheckbox slot='end' checked={user.checked} color='secondary' onIonChange={e => {
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
    ))

    const GrpList = () => groupMembers.map(user => (
        <IonItem key={user.id}>
            <IonAvatar slot='start'>
                <img src={user.photoUrl} alt="avatar" />
            </IonAvatar>
            <IonLabel>{user.nickname}</IonLabel>
        </IonItem>
    ))

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonBackButton/>
                    </IonButtons>
                    <IonTitle>Create Group</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className='ion-padding'>
                <div hidden={AddSubject}>
                    <IonList>
                        <IonListHeader>Add Participants</IonListHeader>
                        <ListUser />
                    </IonList>
                    <IonFab vertical='bottom' horizontal='end' slot='fixed'>
                        <IonFabButton fill='clear' onClick={() => {
                            if (groupMembers.length > 0) {
                                setAddSubject(true)
                            } else createToast('Add Atleast 1 member.')
                        }}>
                            <IonIcon icon={arrowForwardOutline}/>
                        </IonFabButton>
                    </IonFab>
                </div>

                <div hidden={!AddSubject}>
                    
                    <IonList>
                        <IonItem>
                            <IonLabel position='stacked'>Group Name</IonLabel>
                            <IonInput required placeholder='Your Group Name ...' value={grpName} onIonChange={(e) => setGrpName(e.target.value)}></IonInput>
                        </IonItem>
                        <IonItemDivider/>
                        <IonListHeader>Members</IonListHeader>
                        <GrpList/>
                    </IonList>
                    <IonFab vertical='bottom' horizontal='start' slot='fixed'>
                        <IonFabButton color='secondary' fill='clear' onClick={() => { setAddSubject(false) }}>
                            <IonIcon icon={arrowBackOutline} />
                        </IonFabButton>
                    </IonFab>
                    <IonFab vertical='bottom' horizontal='end' slot='fixed'>
                        <IonFabButton color='success' fill='clear' onClick={() => { generateGroup() }}>
                            <IonIcon icon={arrowForwardOutline} />
                        </IonFabButton>
                    </IonFab>
                </div>
                <IonLoading
                    isOpen={showLoading}
                    onDidDismiss={() => setShowLoading(false)}
                    message={'Please wait...'}
                    duration={5000}
                />
            </IonContent>
        </IonPage>
    )
}

export default withAuthorization(GroupCreate)
