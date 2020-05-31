import React, { useState, useContext, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonProgressBar } from '@ionic/react';
import { FirebaseContext } from '../context/FirebaseContext';
import WelcomeBox from '../components/WelcomeBox';
import withAuthorization from '../context/withAuthorization';
import ChatBox from '../components/ChatBox';
const Dashboard = () => {
  const firebase = useContext(FirebaseContext);

  // let peerUser = JSON.parse(sessionStorage.getItem('peerUser'));
  useEffect(() => {
    setPeerUser(JSON.parse(sessionStorage.getItem('peerUser')));
    
    firebase.checkPresence(localStorage.getItem('id'))
    return () => {
      setPeerUser(JSON.parse(sessionStorage.getItem('peerUser')));
    }
  }, [firebase])
  // console.log(peerUser);

  const [loading, setLoading] = useState(false);
  const [peerUser, setPeerUser] = useState(JSON.parse(sessionStorage.getItem('peerUser')));


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
