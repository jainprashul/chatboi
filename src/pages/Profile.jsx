import React, { useState, useContext } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonLoading, useIonViewDidEnter, IonToggle, IonFooter } from '@ionic/react';
import { alertController } from '@ionic/core';
import withAuthorization from '../context/withAuthorization';
import { logOut, camera, personCircleOutline } from 'ionicons/icons';
import { AppString } from '../config/const';
import { createToast, useLocalStorage, compressImage } from '../config/hooks';
import { FirebaseContext, saveDeviceToken } from '../context/FirebaseContext';
import './Profile.css';

let newAvatar = null;
let refInput;
const Profile = () => {
  const firebase = useContext(FirebaseContext);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useLocalStorage('notification', false);

  const [currentUser, setCurrentUser] = useState({
    id: localStorage.getItem(AppString.ID),
    avatar: localStorage.getItem(AppString.PHOTO_URL),
    nickname: localStorage.getItem(AppString.NICKNAME),
    aboutMe: localStorage.getItem(AppString.ABOUT_ME),
  })
  const [photoUrl, setPhotoUrl] = useState(currentUser.avatar);
  const [nickname, setNickname] = useState(currentUser.nickname);
  const [aboutMe, setAboutMe] = useState(currentUser.aboutMe);
  

  useIonViewDidEnter(() => {
    setCurrentUser({
      id: localStorage.getItem(AppString.ID),
      avatar: localStorage.getItem(AppString.PHOTO_URL),
      nickname: localStorage.getItem(AppString.NICKNAME),
      aboutMe: localStorage.getItem(AppString.ABOUT_ME),
    });
  })

  // useEffect(() => {
  //   // saveDeviceToken();
  // }, [notification])

  function onChangeAvatar(event) {
    if (event.target.files && event.target.files[0]) {
      // Check this file is an image?
      compressImage(event.target.files).then(({ photo, info }) => {
        
        const prefixFiletype = photo.type
        if (prefixFiletype.indexOf(AppString.PREFIX_IMAGE) !== 0) {
          createToast('File not Image.', 'danger');
          return
        }
        newAvatar = photo.data
        console.log(URL.createObjectURL(photo.data));
        setPhotoUrl(URL.createObjectURL(photo.data));
      })
      
    } else {
      createToast('Something wrong with input file', 'danger');
    }
  };

  function uploadAvatar() {
    setLoading(true);
    if (newAvatar) {
      const uploadTask = firebase.storage
        .ref(AppString.USER_PROFILE_IMAGE)
        .child(currentUser.id)
        .put(newAvatar);
      uploadTask.on(
        AppString.UPLOAD_CHANGED,
        null,
        err => {
          createToast(err.message, 'danger');
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log(downloadURL);
            
            updateUserInfo(downloadURL, true);
          })
        }
      )
    } else {
      updateUserInfo();
    }
  };

  function updateUserInfo(downloadURL = null, isPhotoUrl = false) {
    let newInfo;
    if (isPhotoUrl) {
      newInfo = {
        nickname, aboutMe, photoUrl: downloadURL
      }
    } else {
      newInfo = { nickname, aboutMe }
    }

    firebase.firestore.collection(AppString.USERS)
      .doc(currentUser.id)
      .update(newInfo)
      .then(() => {
        localStorage.setItem(AppString.NICKNAME, nickname)
        localStorage.setItem(AppString.ABOUT_ME, aboutMe)
        if (isPhotoUrl) {
          localStorage.setItem(AppString.PHOTO_URL, downloadURL)
        }
        setLoading(false);
        createToast('Update info success');
      })
    
  }


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
          // history.replace(ROUTE.signin);
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
          <IonTitle className='ion-text-center ion-text-capitalize'>PROFILE</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={signOut}>
              <IonIcon slot='icon-only' icon={logOut} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-text-center ion-padding' >
        <img className="useravatar" alt="Avatar" src={photoUrl ? photoUrl : personCircleOutline} />
        <div onClick={()=>refInput.click()}><IonIcon icon={camera}></IonIcon></div>
        <div hidden={true} className="ion-hide viewWrapInputFile">
          <input
            ref={el => {
              refInput = el
            }}
            accept="image/*"
            className="viewInputFile"
            type="file"
            onChange={onChangeAvatar}
          />
        </div>
        <IonItem>
          <IonLabel position='stacked'>Nick Name</IonLabel>
          <IonInput required placeholder='Your NickName ...' value={nickname} onIonChange={(e)=> setNickname(e.target.value)}></IonInput>
        </IonItem>
        <br/>
        <IonItem>
          <IonLabel position='stacked'>About Me</IonLabel>
          <IonInput value={aboutMe} placeholder="Tell about yourself..." onIonChange={(e)=> setAboutMe(e.target.value)}></IonInput>
        </IonItem>
        <br/>
        <IonButton onClick={uploadAvatar}>Update</IonButton>
        {/* <IonButton color='danger' expand='block' onClick={deleteUser}>Delete User</IonButton> */}

        <br />
        <br />
        <br/><br/><br/>

        <IonItem>
          <IonToggle checked={notification} disabled={notification} onIonChange={(e) => {
            setNotification(e.detail.checked);
            if (e.detail.checked) {
              saveDeviceToken();
            }
          }} />
          <IonLabel>Enable Messaging Notification</IonLabel>
        </IonItem>
        



        <IonLoading isOpen={loading}></IonLoading>
      </IonContent>
      <IonFooter>
        
      </IonFooter>
    </IonPage>
  );
};

export default withAuthorization(Profile);
