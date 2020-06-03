import React, { useState, useContext, useEffect, useRef } from 'react';
import { IonToolbar, IonButtons, IonButton, IonIcon, useIonViewDidLeave, useIonViewWillEnter, IonInput, IonFooter, IonHeader, IonProgressBar, IonContent, IonBackButton, IonTitle, useIonViewDidEnter } from '@ionic/react';
import { FirebaseContext } from '../context/FirebaseContext';
import { image, pricetag, send, handRight } from 'ionicons/icons';
import { AppString, images } from '../config/const';
import { createToast, useTabHide } from '../config/hooks';
import './chatbox.css'
import moment from 'moment'
import { useChatBox } from '../config/useChatBox';

// let listMessage = []

const ChatBox = ({ peerUser }) => {

  const firebase = useContext(FirebaseContext);

  // const [showStickers, setShowStickers] = useState(false);
  const [listMessage, setListMessage] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const messagesEnd = useRef(null)
  const imgInput = useRef(null);

  const { loading, removeListener, onSendMessage, onChoosePhoto, openListSticker, showStickers, getGifImage } = useChatBox(peerUser, setMsg, setListMessage);

  let currentUser = {
    id: localStorage.getItem(AppString.ID),
    avatar: localStorage.getItem(AppString.PHOTO_URL),
    nickname: localStorage.getItem(AppString.NICKNAME),
  }

  useTabHide();

  // console.log( groupChatId, currentPhotoFile);

  useIonViewDidEnter(() => {
    // getMsgHistory();
    console.log("Entered chat box", peerUser.id);
  });


  useEffect(() => {
    scrollToBottom();
    // getMsgHistory();
  });


  useIonViewDidLeave(() => {
    if (removeListener) {
      removeListener();
    }
    const tabbar = document.querySelector("ion-tab-bar");
    tabbar.classList.toggle('ion-hide', false);
    console.log('showed tab');
  });


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

  const RenderMessages = () => (listMessage.length) ? 
    listMessage.map((item) => {
      if (item.idFrom === currentUser.id) {
        // Item right (my message)
        if (item.type === 0) {
          return (
            <div className="viewItemRight2" key={item.timestamp}>
              <div className="viewItemRight" >
                <span className="textContentItem">{item.context}</span>
              </div>
              <p className="textTimeRight">
                {moment(Number(item.timestamp)).fromNow()}
              </p>
            </div>
          )
        } else if (item.type === 1) {
          return(
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
          return(
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
          return(
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
          return(
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
          return(
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
    })
  : (
    <div className = "viewWrapSayHi">
          <span className = "textSayHi">Say hi to new friend</span >
    <img
      className="imgWaveHand"
      src={handRight}
      alt="wave hand"
    />
    </div >
  );

  function RenderListMessage() {
    console.log('render mesges');

    if (listMessage.length > 0) {
      let viewMessages = [];
      listMessage.forEach((item) => {
        if (item.idFrom === currentUser.id) {
          // Item right (my message)
          if (item.type === 0) {
            viewMessages.push(
              <div className="viewItemRight2" key={item.timestamp}>
                <div className="viewItemRight" >
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

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton />
          </IonButtons>
          <IonTitle>
            <div className="headerChatBoard">
              <img
                className="viewAvatarItem"
                src={peerUser.photoUrl}
                alt="icon avatar"
              />
              <span className="textHeaderChatBoard">
                {peerUser.nickname}
              </span>
            </div>

          </IonTitle>
        </IonToolbar>
        <IonProgressBar hidden={!loading} type='indeterminate' ></IonProgressBar >

      </IonHeader>
      <IonContent>
        <div className="viewChatBoard">
          {/* List message */}
          <div className="viewListContentChat">
            {/* <RenderListMessage /> */}
            <RenderMessages/>
            <div
              style={{ float: 'left', clear: 'both' }}
              ref={messagesEnd}
            />
          </div>
          {/* Stickers */}
          {showStickers ? renderStickers() : null}
        </div>
      </IonContent>
      {/* View bottom */}
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
            <IonButton onClick={() => { onSendMessage(msg, 0); }} >
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

    </>
  )

}






export default ChatBox;
