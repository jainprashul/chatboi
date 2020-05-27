import React, { useState, useContext } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { alertController } from '@ionic/core';
import { FirebaseContext } from '../context/FirebaseContext';
import { logOut } from 'ionicons/icons';
import { AppString, ROUTE } from '../config/const';
const Dashboard = ({history}) => {
  const firebase = useContext(FirebaseContext);
  let currentUser = {
    id: localStorage.getItem(AppString.ID),
    avatar: localStorage.getItem(AppString.PHOTO_URL),
    nickname: localStorage.getItem(AppString.NICKNAME),
  }
  const [loading, setLoading] = useState(false);

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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className='ion-text-center ion-text-capitalize'>Chat Boio</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={signOut}>
              <IonIcon  slot='icon-only' icon={logOut}/>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>

      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
