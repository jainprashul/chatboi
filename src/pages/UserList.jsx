import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonProgressBar, IonItem, IonAvatar, IonLabel, IonList, IonListHeader, IonIcon, IonRefresher, IonRefresherContent } from '@ionic/react';
import { ROUTE } from '../config/const';
import { chevronDownCircleOutline, egg } from 'ionicons/icons';
import withAuthorization from '../context/withAuthorization';
import { useUserList } from '../config/getUsers';

const UserList = () => {

  const { loading , onlineUsers , getListUser , userList} =  useUserList();

  function doRefresh(e) {
    getListUser().then(() => {
      e.detail.complete()
    })
  }

  const ListUser = () => userList.map(user => (
    <IonItem key={user.id} href={ROUTE.chat+ '?userid=' +user.id} onClick={() => {
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
          <ListUser />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default withAuthorization(UserList);
