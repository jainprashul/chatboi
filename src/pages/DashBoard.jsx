import React, { useState, useContext } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonImg, IonCard, IonCardContent, IonCardHeader, IonLabel, IonCardSubtitle, IonProgressBar } from '@ionic/react';
import { alertController } from '@ionic/core';
import { FirebaseContext } from '../context/FirebaseContext';
import { logOut } from 'ionicons/icons';
import { AppString, ROUTE } from '../config/const';
import WelcomeBox from '../components/WelcomeBox';
import withAuthorization from '../context/withAuthorization';
import ChatBox from '../components/ChatBox';
const Dashboard = ({ history }) => {
  const firebase = useContext(FirebaseContext);

  let peerUser = JSON.parse(sessionStorage.getItem('peerUser'));
  // console.log(peerUser);

  const [loading, setLoading] = useState(false);


  return (
    <IonPage>
      <IonHeader>
        {!peerUser && <IonToolbar>
          <IonTitle className='ion-text-center ion-text-capitalize'>ChatBox</IonTitle>
        </IonToolbar>}
        <IonProgressBar hidden={!loading} type='indeterminate' ></IonProgressBar >

        {peerUser && <div className="headerChatBoard">
          <img
            className="viewAvatarItem"
            src={peerUser.photoUrl}
            alt="icon avatar"
          />
          <span className="textHeaderChatBoard">
            {peerUser.nickname}
          </span>
        </div>}

      </IonHeader>
      <IonContent>
        {!peerUser ? <WelcomeBox /> : <ChatBox peerUser={peerUser} loading={loading} setLoading={setLoading} />}

      </IonContent>
    </IonPage>
  );
};

export default withAuthorization(Dashboard);
