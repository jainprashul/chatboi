import React, { useState, useContext } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonImg, IonCard, IonCardContent, IonCardHeader, IonLabel, IonCardSubtitle } from '@ionic/react';
import { alertController } from '@ionic/core';
import { FirebaseContext } from '../context/FirebaseContext';
import { logOut } from 'ionicons/icons';
import { AppString, ROUTE } from '../config/const';
import WelcomeBox from '../components/WelcomeBox';
import withAuthorization from '../context/withAuthorization';
import ChatBox from '../components/ChatBox';
const Dashboard = ({history}) => {
  const firebase = useContext(FirebaseContext);
  
  let peerUser = JSON.parse(sessionStorage.getItem('peerUser'));
  // console.log(peerUser);
  
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
        {!peerUser ? <WelcomeBox /> : <ChatBox peerUser={peerUser}/>}
        
      </IonContent>
    </IonPage>
  );
};

export default withAuthorization(Dashboard);
