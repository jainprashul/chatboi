import React, { useState, useContext } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonLoading } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import withAuthorization from '../context/withAuthorization';
import { trailSignOutline, logOut, camera } from 'ionicons/icons';
import { AppString, images } from '../config/const';
import { createToast } from '../config/hooks';
import { FirebaseContext } from '../context/FirebaseContext';
import './Profile.css';

let newAvatar = null;
let newPhotoUrl = '';
let refInput;
const Profile = () => {
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
        nickname, aboutMe, photoUrl
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


  return (
    <IonPage>
      <IonToolbar>
        <IonTitle className='ion-text-center ion-text-capitalize'>Chat Boi</IonTitle>
        <IonButtons slot='end'>
          <IonButton >
            <IonIcon slot='icon-only' icon={logOut} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <IonContent className='ion-text-center ion-padding' >
        <h2>PROFILE</h2>
        <img className="avatar" alt="Avatar" src={photoUrl} />
        <div onClick={()=>refInput.click()}><IonIcon icon={camera}></IonIcon></div>
        <div className="viewWrapInputFile">
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
          <IonInput required placeholder='Your NickName ...' value={nickname} onIonChange={(e)=> setNickname(e.target.id)}></IonInput>
        </IonItem>
        <br/>
        <IonItem>
          <IonLabel position='stacked'>About Me</IonLabel>
          <IonInput value={aboutMe} placeholder="Tell about yourself..." onIonChange={(e)=> setAboutMe(e.target.id)}></IonInput>
        </IonItem>
        <br/>
        <IonButton onClick={uploadAvatar}>Update</IonButton>

        <IonLoading isOpen={loading}></IonLoading>
      </IonContent>
    </IonPage>
  );
};

export default withAuthorization(Profile);
