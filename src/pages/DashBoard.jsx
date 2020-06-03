import React, { useState, useEffect } from 'react';
import { IonPage, IonButton, useIonViewWillEnter } from '@ionic/react';
import WelcomeBox from '../components/WelcomeBox';
import withAuthorization from '../context/withAuthorization';
import ChatBox from '../components/ChatBox';
import { useUserList } from '../config/getUsers';

let deferredPrompt;
const Dashboard = ({location}) => {
  // const firebase = useContext(FirebaseContext);
  let x = location.search;
  let peerUserid = x.substr(8);

  const { getUser } = useUserList();

  const [installHide, setInstallHide] = useState(true);
  const [peerUser, setPeerUser] = useState( () => {
    const user = getUser(peerUserid).then(user => {
      setPeerUser(user)
    })
    // return user
  });

  // let peerUser = JSON.parse(sessionStorage.getItem('peerUser'));
// console.log(peerUser);

  useIonViewWillEnter(() => {
    getUser(peerUserid).then(user => {
      setPeerUser(user);
      setPeerUser(JSON.parse(sessionStorage.getItem('peerUser')));

    })
    console.log('view will enter');
    
  })
  useEffect(() => {

    window.addEventListener('beforeinstallprompt', (e) => {
      // e.preventDefault();
      deferredPrompt = e;
      setInstallHide(false);
    });

    window.addEventListener('appinstalled', (event) => {
      console.log('👍', 'appinstalled', event);
    });
    
    // // firebase.checkPresence(localStorage.getItem('id'))
    // return () => {
    //   setPeerUser(JSON.parse(sessionStorage.getItem('peerUser')));
    // }
  }, [])
  // console.log(peerUser);

  const InstallBtn = () => (<IonButton hidden={installHide} color='dark' expand='full' onClick={() => {
    const p = deferredPrompt;
    if (!p) { return }
    p.prompt();
    p.userChoice.then(() => setInstallHide(true));

  }} >Install App</IonButton>)


  return (
    <IonPage>
      {!(peerUserid && peerUser) ? <WelcomeBox Installbtn={InstallBtn} /> : <ChatBox peerUser={peerUser} Installbtn={InstallBtn} />}
    </IonPage>
  );
};

export default withAuthorization(Dashboard);
