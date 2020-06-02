import React, { useState, useContext, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonProgressBar, IonButton } from '@ionic/react';
import { FirebaseContext } from '../context/FirebaseContext';
import WelcomeBox from '../components/WelcomeBox';
import withAuthorization from '../context/withAuthorization';
import ChatBox from '../components/ChatBox';
import { useUserList } from '../config/getUsers';

let deferredPrompt;
const Dashboard = ({location}) => {
  // const firebase = useContext(FirebaseContext);
  let x = location.search;
  let peerUserid = x.substr(8);
  // console.log(x , peerUserid);

  const { getUser } = useUserList();

  const [installHide, setInstallHide] = useState(true);
  const [loading, setLoading] = useState(false);
  const [peerUser, setPeerUser] = useState(JSON.parse(sessionStorage.getItem('peerUser')));

  // let peerUser = JSON.parse(sessionStorage.getItem('peerUser'));
  useEffect(() => {

    window.addEventListener('beforeinstallprompt', (e) => {
      // e.preventDefault();
      deferredPrompt = e;
      setInstallHide(false);
    });

    window.addEventListener('appinstalled', (event) => {
      console.log('👍', 'appinstalled', event);
    });
    getUser(peerUserid)
    setPeerUser(JSON.parse(sessionStorage.getItem('peerUser')));
    
    // firebase.checkPresence(localStorage.getItem('id'))
    return () => {
      setPeerUser(JSON.parse(sessionStorage.getItem('peerUser')));
    }
  }, [])
  // console.log(peerUser);




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
        <IonButton hidden={installHide} color='dark' expand='full' onClick={() => {
          const p = deferredPrompt;
          if (!p) { return }
          p.prompt();
          p.userChoice.then(() => setInstallHide(true));

        }} >Install App</IonButton>
        {!peerUser ? <WelcomeBox /> : <ChatBox peerUser={peerUser} loading={loading} setLoading={setLoading} />}

      </IonContent>
    </IonPage>
  );
};

export default withAuthorization(Dashboard);
