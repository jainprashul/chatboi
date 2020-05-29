import React, { useContext, useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonProgressBar, IonItem, IonAvatar, IonLabel, IonList, IonListHeader, IonIcon } from '@ionic/react';
import { alertController } from '@ionic/core';
import { FirebaseContext } from '../context/FirebaseContext';
import { AppString, ROUTE } from '../config/const';
import { logOut } from 'ionicons/icons';
import withAuthorization from '../context/withAuthorization';

const UserList = ({history}) => {

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

  function signOut() {

    alertController.create({
      header: 'Sign Out !',
      subHeader: "Are you sure?",
      backdropDismiss: false,
      buttons: [{
        text: 'Yes',
        role: 'ok',
        cssClass: 'signout',
        handler: () => {
          firebase.doSignOut();
          history.push(ROUTE.signin);
        }
      },
      {
        text: 'No',
        role: 'cancel',
        cssClass: 'signout',
      }
      ]
    }).then(res => res.present());
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
    </IonItem>
  ))
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className='ion-text-center ion-text-capitalize'>Chat Boio</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={signOut}>
              <IonIcon slot='icon-only' icon={logOut} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonProgressBar hidden={!loading} type='indeterminate'></IonProgressBar>

      </IonHeader>
      <IonContent className='ion-padding'>

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
