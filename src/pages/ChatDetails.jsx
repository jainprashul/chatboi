import React, { useState } from 'react'
import { IonPage, IonToolbar, IonHeader, IonContent, IonTitle, IonCard, IonCardHeader, IonCardContent, IonButtons, IonBackButton, IonCardTitle, IonCardSubtitle, IonImg, IonLabel, IonAvatar, IonItem, IonList, IonListHeader, useIonViewWillEnter } from '@ionic/react'
import moment from 'moment'
import withAuthorization from '../context/withAuthorization';
import { useGroups } from '../config/useGroups';

const ChatDetails = ({location}) => {
    console.log(location);
    const chat = location.state.chat;
    const { groupMembersList } = useGroups();

    const [members, setmembers] = useState([])

    useIonViewWillEnter(
        async () => {
            if(chat){
                groupMembersList(chat.id).then(list => {
                setmembers(list)
            })
            }
        }
    )

    const MembersList = () => members.map(user => (
        <IonItem key={user.id} >
            <IonAvatar slot='start'>
                <img src={user.photoUrl} alt="avatar" />
            </IonAvatar>
            <IonLabel>{user.nickname}</IonLabel>
        </IonItem> 
    ))
    
    function isGroupChat() {
        return (chat.id).startsWith('G-');
    }
    if (chat){
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot='start'>
                            <IonBackButton />
                        </IonButtons>
                        <IonTitle>{chat.nickname}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonCard className=''>

                        <IonCardHeader className='ion-padding ion-text-center'>
                            <br />
                            <img alt="" src={chat.photoUrl} height='200' />
                            <IonCardTitle>{chat.nickname}</IonCardTitle>
                            {isGroupChat() && <IonCardSubtitle>Created By : {chat.createdBy.nickname}, {moment(chat.dateCreated).fromNow()}</IonCardSubtitle>}
                        </IonCardHeader>
                        <IonCardContent className='ion-padding'>
                            {
                                isGroupChat() ? (
                                    <IonList>
                                        <IonListHeader>{members.length} Participants</IonListHeader>
                                        <MembersList/>
                                    </IonList>
                                ) : (<p>About Me: {chat.aboutMe}</p>)
                            }
                        </IonCardContent>
                    </IonCard>
                </IonContent>

            </IonPage>
        )
    } else {
        return (<div></div>)
    }
}

export default withAuthorization(ChatDetails)
