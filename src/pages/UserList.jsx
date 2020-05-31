import React, { useContext, useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonProgressBar, IonItem, IonAvatar, IonLabel, IonList, IonListHeader, IonIcon, IonRefresher, IonRefresherContent } from '@ionic/react';
import { FirebaseContext } from '../context/FirebaseContext';
import { AppString, ROUTE } from '../config/const';
import { chevronDownCircleOutline, egg } from 'ionicons/icons';
import withAuthorization from '../context/withAuthorization';

const UserList = () => {

  let currentUser = {
    id: localStorage.getItem(AppString.ID),
    avatar: localStorage.getItem(AppString.PHOTO_URL),
    nickname: localStorage.getItem(AppString.NICKNAME),
  }

  const [userList, setUserList] = useState([])

  const firebase = useContext(FirebaseContext);
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    setLoading(true)
    getListUser()
  }, [])

  function doRefresh(e) {
    getListUser().then(() => {
      e.detail.complete()
    })
  }



  const ListUser = () => userList.map(user => (
    <IonItem key={user.id} href={ROUTE.chat} onClick={() => {
      sessionStorage.setItem('peerUser', JSON.stringify(user))
    }}>
      <IonAvatar slot='start'>
        <img src={user.photoUrl} alt="avatar" />
      </IonAvatar>
      <IonLabel>
        {user.nickname}
        <p>About me: {user.aboutMe}</p>
      </IonLabel>
      <IonIcon hidden={!user.isOnline} color='success' icon={egg} slot='end'></IonIcon>
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
