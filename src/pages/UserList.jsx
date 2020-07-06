import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonProgressBar, IonItem, IonAvatar, IonLabel, IonList, IonListHeader, IonIcon, IonRefresher, IonRefresherContent, IonActionSheet, IonModal, IonFab, IonFabButton, IonButtons, IonButton, IonSearchbar, useIonViewDidEnter, IonPopover } from '@ionic/react';
import { ROUTE, logo, AppString } from '../config/const';
import { chevronDownCircleOutline, egg, close, addCircle, add, peopleCircleOutline, ellipsisVertical } from 'ionicons/icons';
import withAuthorization from '../context/withAuthorization';
import { useUserList } from '../config/useUserList';
import SkeletonList from '../components/SkeletonList';

let deferredPrompt;
const UserList = () => {
  const [installHide, setInstallHide] = useState(true);
  const { loading, onlineUsers, getListUser, addFriend, getFriendsList , friendsList, chatList, searchList, searchUsers, userListOnInit} = useUserList();
  const [selectedUser, setSelectedUser] = useState(null);
  const [modelOpen, setModelOpen] = useState(false);
  const [showPopover, setShowPopover] = useState({
    open: false,
    event: undefined
  })
  
  useIonViewDidEnter(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // e.preventDefault();
      deferredPrompt = e;
      setInstallHide(false);
    });

    window.addEventListener('appinstalled', (event) => {
      console.log('👍', 'appinstalled', event);
    });

  });

  useEffect(() => {
    userListOnInit()
  }, [])
  


  function doRefresh(e) {
    getListUser().then(users => {
      getFriendsList(users);
      if(e) {
        e.detail.complete();
        console.log(chatList);
      }
    });
  }

  const InstallBtn = () => (<IonButton hidden={installHide} color='dark' expand='full' onClick={() => {
    const p = deferredPrompt;
    if (!p) { return }
    p.prompt();
    p.userChoice.then(() => setInstallHide(true));

  }} >Install App</IonButton>)

  

  const ListUser = () => chatList.map(user => (
    <IonItem key={user.id} routerLink={ROUTE.chat + '?userid=' + user.id} onClick={() => {
      sessionStorage.setItem('peerUser', JSON.stringify(user))
    }}>
      <IonAvatar slot='start'>
        <img src={user.photoUrl} alt="avatar" />
      </IonAvatar>
      <IonLabel>
        {user.nickname}
        <p>{
          user.lastMsg ? user.lastMsg : ('About me: ' +user.aboutMe)
        }</p>
      </IonLabel>
      <IonIcon hidden={!onlineUsers.includes(user.id)} color='success' icon={egg} slot='end'></IonIcon>
    </IonItem>
  ))
  const ModelListUser = () => searchList.map(user => (
    <IonItem key={user.id} onClick={() => {
      setSelectedUser(user.id)
    }}>
      <IonAvatar slot='start'>
        <img src={user.photoUrl} alt="avatar" onError={`this.src=${peopleCircleOutline}`}/>
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
          <IonTitle className=' ion-text-capitalize'>
            
            <img src={logo} style={{ height: '2rem', left: '0' }} alt="" /> <span style={{ fontSize: '1.5rem', marginLeft: '6rem' }}>{AppString.APP_NAME}</span>
            
          </IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={(e) => {
              setShowPopover({
                open: true,
                event: e.nativeEvent
              })
            }}>
              <IonIcon icon={ellipsisVertical} slot='icon-only'></IonIcon>
            </IonButton>
          </IonButtons>
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
        <InstallBtn/>
        <IonList>
          <IonListHeader>
            <IonLabel>Chat List</IonLabel>
          </IonListHeader>
          {loading ? <SkeletonList/> : <ListUser/>}
          
        </IonList>

        <IonFab  vertical='bottom' horizontal='end' slot='fixed' >
          <IonFabButton fill='clear' onClick={() => { setModelOpen(true) }}>
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
        </IonModal>
        <IonPopover isOpen={showPopover.open}
          event={showPopover.event}
          onDidDismiss={e => setShowPopover({ open: false, event: undefined })}>
          <IonList >
            <IonItem lines='none' routerLink={ROUTE.groups}>Create Group</IonItem>
          </IonList>
        </IonPopover>
        
      </IonContent>
    </IonPage>
  );
};

export default withAuthorization(UserList);
