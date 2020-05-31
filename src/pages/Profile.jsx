import React, { useState, useContext } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonLoading } from '@ionic/react';
import { alertController } from '@ionic/core';
import withAuthorization from '../context/withAuthorization';
import { trailSignOutline, logOut, camera } from 'ionicons/icons';
import { AppString, images, ROUTE } from '../config/const';
import { createToast } from '../config/hooks';
import { FirebaseContext } from '../context/FirebaseContext';
import './Profile.css';

let newAvatar = null;
let newPhotoUrl = '';
let refInput;
const Profile = ({history}) => {
  const firebase = useContext(FirebaseContext);
  const [loading, setLoading] = useState(false)
  let currentUser = {
    id: localStorage.getItem(AppString.ID),
    avatar: localStorage.getItem(AppString.PHOTO_URL),
    nickname: localStorage.getItem(AppString.NICKNAME),
    aboutMe: localStorage.getItem(AppString.ABOUT_ME),
  }

  const [photoUrl, setPhotoUrl] = useState(currentUser.avatar);
  const [nickname, setNickname] = useState(currentUser.nickname);
  const [aboutMe, setAboutMe] = useState(currentUser.aboutMe);

  function onChangeAvatar(event) {
    if (event.target.files && event.target.files[0]) {
      // Check this file is an image?
      const prefixFiletype = event.target.files[0].type.toString()
      if (prefixFiletype.indexOf(AppString.PREFIX_IMAGE) !== 0) {
        createToast('File not Image.', 'danger');
        return
      }
      newAvatar = event.target.files[0]
      console.log(URL.createObjectURL(event.target.files[0]));
      setPhotoUrl(URL.createObjectURL(event.target.files[0]));
    } else {
      createToast('Something wrong with input file', 'danger');
    }
  };

  function uploadAvatar() {
    setLoading(true);
    if (newAvatar) {
      const uploadTask = firebase.storage
        .ref()
        .child(currentUser.id)
        .put(newAvatar)
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
      .then(data => {
        localStorage.setItem(AppString.NICKNAME, nickname)
        localStorage.setItem(AppString.ABOUT_ME, aboutMe)
        if (isPhotoUrl) {
          localStorage.setItem(AppString.PHOTO_URL, downloadURL)
        }
        setLoading(false);
        createToast('Update info success');
      })
    
  }

  function deleteUser() {
    alertController.create({
      header: 'Delete User Profile !',
      subHeader: "Are you sure?",
      backdropDismiss: false,
      buttons: [{
        text: 'Yes',
        role: 'ok',
        cssClass: 'signout',
        handler: () => {
          firebase.deleteUser();
          console.log('user deleted');
          
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
        <img className="avatar" alt="Avatar" src={photoUrl} />
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


        <IonLoading isOpen={loading}></IonLoading>
      </IonContent>
    </IonPage>
  );
};

export default withAuthorization(Profile);
