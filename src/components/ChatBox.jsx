import React, { useState, useContext, useEffect, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonImg, IonCard, IonCardContent, IonCardHeader, IonLabel, IonCardSubtitle, IonProgressBar, IonItem, useIonViewDidLeave, useIonViewWillEnter, IonInput, IonFooter } from '@ionic/react';
import { alertController } from '@ionic/core';
import { FirebaseContext } from '../context/FirebaseContext';
import { logOut, image, pricetag, send, handRight } from 'ionicons/icons';
import { AppString, ROUTE, images } from '../config/const';
import { createToast } from '../config/hooks';
import './chatbox.css'
import moment from 'moment'

let removeListener = null;
let listMessage = []
let groupChatId = null;
let currentPhotoFile = null;

const ChatBox = ({ history, peerUser, loading, setLoading }) => {

  const firebase = useContext(FirebaseContext);
  let currentUser = {
    id: localStorage.getItem(AppString.ID),
    avatar: localStorage.getItem(AppString.PHOTO_URL),
    nickname: localStorage.getItem(AppString.NICKNAME),
  }

  // const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const messagesEnd = useRef(null)
  const imgInput = useRef(null);



  // console.log( groupChatId, currentPhotoFile);

  useIonViewWillEnter(() => {
    getMsgHistory();
    console.log("Entered chat box", peerUser.id);
  });


  useEffect(() => {
    scrollToBottom();
  });


  useIonViewDidLeave(() => {
    if (removeListener) {
      removeListener();
    }
  });


  function getMsgHistory() {
    if (removeListener) {
      removeListener();
    }
    listMessage.length = 0
    let msgList = []
    setLoading(true);
    groupChatId = (hashString(currentUser.id) <= hashString(peerUser.id)) ? `${currentUser.id}-${peerUser.id}` : `${peerUser.id}-${currentUser.id}`;
    console.log(groupChatId);
    removeListener = firebase.message(groupChatId).onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === AppString.DOC_ADDED) {
          msgList.push(change.doc.data());
        }
      })
      listMessage = msgList;
      console.log('listening');
      setLoading(false);
    }, err => createToast(err.toString())
    )
  };

  function openListSticker() {
    setShowStickers(!showStickers);
  };

  /** Send The message
  * @type type 0 = text
  * @type type 1 = images
  * @type type 2 = stickers 
  */
  function onSendMessage(content, type) {
    //close stickerbox
    if (showStickers && type === 2) {
      setShowStickers(false);
    }
    // if no content or msg
    if (content.trim() === '') return;

    const timestamp = (Date.now()).toString();

    const msgItem = {
      idFrom: currentUser.id,
      idTo: peerUser.id,
      timestamp,
      context: content.trim(),
      type
    }
    console.log(groupChatId, timestamp);
    firebase.message(groupChatId).doc(timestamp).set(msgItem).then(() => {
      setMsg('')
    }).catch(err => createToast(err.toString()));
  };

  function onChoosePhoto(e) {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      currentPhotoFile = (e.target.files[0]);
      // Check this file is an image?
      const prefixFiletype = e.target.files[0].type.toString()
      if (prefixFiletype.indexOf(AppString.PREFIX_IMAGE) === 0) {
        uploadPhoto();
      } else {
        setLoading(false)
        createToast('This file is not an image');
      }
    }
    else {
      setLoading(false);
    }
  };

  function uploadPhoto() {
    if (currentPhotoFile) {
      const timestamp = (Date.now()).toString();

      const uploadTask = firebase.storage.ref().child(timestamp).put(currentPhotoFile);
      uploadTask.on(AppString.UPLOAD_CHANGED, null, err => {
        setLoading(false);
        createToast(err.message)
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then(url => {
          setLoading(false);
          onSendMessage(url, 1);
        })
      });
    } else {
      setLoading(false);
      createToast('File is Null');
    }
  };


  const onKeyboardPress = event => {
    if (event.key === 'Enter') {
      onSendMessage(msg, 0)
    }
  };

  const scrollToBottom = () => {
    if (messagesEnd) {
      messagesEnd.current.scrollIntoView({})
    }
  };

  return (
    <div>
      <div className="viewChatBoard">


        {/* List message */}
        <div className="viewListContentChat">
          {renderListMessage()}
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={messagesEnd}
          />
        </div>

        {/* Stickers */}
        {showStickers ? renderStickers() : null}

        <IonFooter>
          <IonToolbar className='bottom'>
            <IonButtons slot='start'>
              <IonButton onClick={() => imgInput.current.click()} >
                <IonIcon icon={image} slot='icon-only'></IonIcon>
              </IonButton>
              <IonButton onClick={() => openListSticker()} >
                <IonIcon icon={pricetag} slot='icon-only'></IonIcon>
              </IonButton>
            </IonButtons>
            <IonInput placeholder='Type your Message...' value={msg} onIonChange={e => setMsg(e.target.value)} onKeyPress={onKeyboardPress}></IonInput>
            <IonButtons slot='end'>
              <IonButton onClick={() => { onSendMessage(msg, 0);}} >
                <IonIcon icon={send} slot='icon-only'></IonIcon>
              </IonButton>
            </IonButtons>
            <input
              ref={imgInput}
              accept="image/*"
              className="viewInputGallery"
              type="file"
              onChange={onChoosePhoto}
            />
          </IonToolbar>
          
       </IonFooter>
        {/* View bottom */}
     </div>

    </div>
  )

  function renderListMessage() {
    if (listMessage.length > 0) {
      let viewMessages = [];
      listMessage.forEach((item, index) => {
        if (item.idFrom === currentUser.id) {
          // Item right (my message)
          if (item.type === 0) {
            viewMessages.push(
              <div className="viewItemRight2">
                <div className="viewItemRight" key={item.timestamp}>
                  <span className="textContentItem">{item.context}</span>
                </div>
                <p className="textTimeRight">
                  {moment(Number(item.timestamp)).fromNow()}
                </p>
              </div>
            )
          } else if (item.type === 1) {
            viewMessages.push(
              <div className="viewItemRight2" key={item.timestamp}>
                <img
                  className="imgItemRight"
                  src={item.context}
                  alt="context message"
                />
                <p className="textTimeRight">
                  {moment(Number(item.timestamp)).fromNow()}
                </p>
              </div>
            )
          } else {
            viewMessages.push(
              <div className="viewItemRight2" key={item.timestamp}>
                <img
                  className="imgItemRight"
                  src={getGifImage(item.context)}
                  alt="context message"
                />
                <p className="textTimeRight">
                  {moment(Number(item.timestamp)).fromNow()}
                </p>
              </div>
            )
          }
        } else {
          // Item left (peer message)
          if (item.type === 0) {
            viewMessages.push(
              <div className="viewWrapItemLeft" key={item.timestamp}>
                <div className="viewWrapItemLeft3">
                  <img
                    src={peerUser.photoUrl}
                    alt="avatar"
                    className="peerAvatarLeft"
                  />
                  <div className="viewItemLeft">
                    <span className="textContentItem">{item.context}</span>
                  </div>
                  
                </div>
                <p className="textTimeLeft">
                  {moment(Number(item.timestamp)).fromNow()}
                </p>
              </div>
            )
          } else if (item.type === 1) {
            viewMessages.push(
              <div className="viewWrapItemLeft2" key={item.timestamp}>
                <div className="viewWrapItemLeft3">
                  <img
                    src={peerUser.photoUrl}
                    alt="avatar"
                    className="peerAvatarLeft"
                  />
                  <div className="viewItemLeft2">
                    <img
                      className="imgItemLeft"
                      src={item.context}
                      alt="content message"
                    />
                  </div>
                </div>
                <p className="textTimeLeft">
                  {moment(Number(item.timestamp)).fromNow()}
                </p>
              </div>
            )
          } else {
            viewMessages.push(
              <div className="viewWrapItemLeft2" key={item.timestamp}>
                <div className="viewWrapItemLeft3">
                  <img
                    src={peerUser.photoUrl}
                    alt="avatar"
                    className="peerAvatarLeft"
                  />
                  <div className="viewItemLeft3" key={item.timestamp}>
                    <img
                      className="imgItemLeft"
                      src={getGifImage(item.context)}
                      alt="content message"
                    />
                  </div>
                </div>
                <p className="textTimeLeft">
                  {moment(Number(item.timestamp)).fromNow()}
                </p>
              </div>
            )
          }
        }
      });
      return viewMessages;
    } else {
      return (
        <div className="viewWrapSayHi">
          <span className="textSayHi">Say hi to new friend</span>
          <img
            className="imgWaveHand"
            src={handRight}
            alt="wave hand"
          />
        </div>
      );
    }
  };

  function renderStickers() {
    return (
      <div className="viewStickers">
        <img
          className="imgSticker"
          src={images.mimi1}
          alt="sticker"
          onClick={() => onSendMessage('mimi1', 2)}
        />
        <img
          className="imgSticker"
          src={images.mimi2}
          alt="sticker"
          onClick={() => onSendMessage('mimi2', 2)}
        />
        <img
          className="imgSticker"
          src={images.mimi3}
          alt="sticker"
          onClick={() => onSendMessage('mimi3', 2)}
        />
        <img
          className="imgSticker"
          src={images.mimi4}
          alt="sticker"
          onClick={() => onSendMessage('mimi4', 2)}
        />
        <img
          className="imgSticker"
          src={images.mimi5}
          alt="sticker"
          onClick={() => onSendMessage('mimi5', 2)}
        />
        <img
          className="imgSticker"
          src={images.mimi6}
          alt="sticker"
          onClick={() => onSendMessage('mimi6', 2)}
        />
        <img
          className="imgSticker"
          src={images.mimi7}
          alt="sticker"
          onClick={() => onSendMessage('mimi7', 2)}
        />
        <img
          className="imgSticker"
          src={images.mimi8}
          alt="sticker"
          onClick={() => onSendMessage('mimi8', 2)}
        />
        <img
          className="imgSticker"
          src={images.mimi9}
          alt="sticker"
          onClick={() => onSendMessage('mimi9', 2)}
        />
      </div>
    )
  }

  function isLastMessageLeft(index) {
    if (
      (index + 1 < listMessage.length &&
        listMessage[index + 1].idFrom === currentUser.id) ||
      index === listMessage.length - 1
    ) {
      return true
    } else {
      return false
    }
  }

  function isLastMessageRight(index) {
    if (
      (index + 1 < listMessage.length &&
        listMessage[index + 1].idFrom !== currentUser.id) ||
      index === listMessage.length - 1
    ) {
      return true
    } else {
      return false
    }
  }



  //done

}



function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

const getGifImage = value => {
  switch (value) {
    case 'mimi1':
      return images.mimi1
    case 'mimi2':
      return images.mimi2
    case 'mimi3':
      return images.mimi3
    case 'mimi4':
      return images.mimi4
    case 'mimi5':
      return images.mimi5
    case 'mimi6':
      return images.mimi6
    case 'mimi7':
      return images.mimi7
    case 'mimi8':
      return images.mimi8
    case 'mimi9':
      return images.mimi9
    default:
      return null
  }
}


export default ChatBox;
