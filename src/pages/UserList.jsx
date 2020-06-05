import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonProgressBar, IonItem, IonAvatar, IonLabel, IonList, IonListHeader, IonIcon, IonRefresher, IonRefresherContent, IonActionSheet, IonModal, IonFab, IonFabButton, IonButtons, IonButton, IonSearchbar } from '@ionic/react';
import { ROUTE } from '../config/const';
import { chevronDownCircleOutline, egg, close, addCircle, add } from 'ionicons/icons';
import withAuthorization from '../context/withAuthorization';
import { useUserList } from '../config/getUsers';
import SkeletonList from '../components/SkeletonList';

const UserList = () => {

  const { loading, onlineUsers, getListUser, addFriend, getFriendsList , friendsList, searchList, searchUsers} = useUserList();
  const [selectedUser, setSelectedUser] = useState(null);
  const [modelOpen, setModelOpen] = useState(false);
  
  

  function doRefresh(e) {
    getListUser().then(users => {
      getFriendsList(users);
      if(e) {
      e.detail.complete();
      }
    });
  }

  

  const ListUser = () => friendsList.map(user => (
    <IonItem key={user.id} routerLink={ROUTE.chat + '?userid=' + user.id} onClick={() => {
      sessionStorage.setItem('peerUser', JSON.stringify(user))
    }}>
      <IonAvatar slot='start'>
        <img src={user.photoUrl} alt="avatar" />
      </IonAvatar>
      <IonLabel>
        {user.nickname}
        <p>About me: {user.aboutMe}</p>
      </IonLabel>
      <IonIcon hidden={!onlineUsers.includes(user.id)} color='success' icon={egg} slot='end'></IonIcon>
    </IonItem>
  ))
  const ModelListUser = () => searchList.map(user => (
    <IonItem key={user.id} onClick={() => {
      setSelectedUser(user.id)
    }}>
      <IonAvatar slot='start'>
        <img src={user.photoUrl} alt="avatar" />
      </IonAvatar>
      <IonLabel>
        {user.nickname}
        <p>About me: {user.aboutMe}</p>
      </IonLabel>
      <IonIcon hidden={!onlineUsers.includes(user.id)} color='success' icon={egg} slot='end'></IonIcon>
    </IonItem>
  ))


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className='ion-text-center ion-text-capitalize'>Users</IonTitle>

        </IonToolbar>
        <IonProgressBar hidden={!loading} type='indeterminate'></IonProgressBar>

      </IonHeader>
      <IonContent className='ion-padding'>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent
            pullingIcon={chevronDownCircleOutline}
            pullingText="Pull to refresh"
            refreshingSpinner="circles"
            refreshingText="Refreshing...">
          </IonRefresherContent>
        </IonRefresher>
        <IonList>
          <IonListHeader>
            <IonLabel>Chat List</IonLabel>
          </IonListHeader>
          {loading ? <SkeletonList/> : <ListUser/>}
          
        </IonList>

        <IonFab vertical='bottom' horizontal='end' >
          <IonFabButton onClick={() => { setModelOpen(true) }}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={modelOpen} onDidDismiss={() => { setModelOpen(false) }}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Search Users</IonTitle>
              <IonButtons slot='end'>
                <IonButton onClick={() => { setModelOpen(false) }}>
                  <IonIcon icon={close}slot='icon-only' ></IonIcon>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className='ion-padding'>
            <IonSearchbar debounce={800} onIonChange={e => searchUsers(e.detail.value)} animated></IonSearchbar>

            
              {loading ? <SkeletonList/> : <ModelListUser/>}
          
          </IonContent>
        </IonModal>

        <IonActionSheet
          isOpen={!!selectedUser}
          buttons={[{
            text: 'Add To Contacts',
            role: 'added',
            icon: addCircle,
            handler: () => {
              addFriend(selectedUser);
              console.log('contact added');
              setModelOpen(false);
              searchUsers()
              doRefresh()
              
            }
          }, {
            text: 'Cancel',
            icon: close,
            role: 'cancel'
          }]}
          onDidDismiss={() => {
            setSelectedUser(null)
          }}
        />
      </IonContent>
    </IonPage>
  );
};

export default withAuthorization(UserList);
