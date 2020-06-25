import React, { useState, useEffect, useRef } from 'react';
import { IonToolbar, IonButtons, IonButton, IonIcon, useIonViewDidLeave, IonInput, IonFooter, IonHeader, IonProgressBar, IonContent, IonBackButton, IonTitle, useIonViewDidEnter, IonList, IonItem, IonPopover } from '@ionic/react';
import { image, pricetag, send, handRight, ellipsisVertical } from 'ionicons/icons';
import { } from '@ionic/core';
import { AppString, images, themes, ROUTE } from '../config/const';
import { useTabHide, createToast } from '../config/hooks';
import './chatbox.css'
import'./themes.css'
import moment from 'moment'
import { useChatBox } from '../config/useChatBox';
import ImagePreview from './ImagePreview';
import { useUserList } from '../config/getUsers';

// let listMessage = []
let theme = localStorage.getItem('ctheme')
let selectedTheme = theme ? parseInt(theme) : 0;

const ChatBox = ({ peerUser, history }) => {
  // const [showStickers, setShowStickers] = useState(false);

  const {removeFriend} = useUserList()
  const [listMessage, setListMessage] = useState([]);
  const [modelOpen, setmodelOpen] = useState(false);
  // const [state, setstate] = useState(initialState)
  const [showPopover, setShowPopover] = useState({
    open: false,
    event: undefined
  })
  const [imgPrev, setImgPrev] = useState(null);
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
    let theme = localStorage.getItem('ctheme')
    selectedTheme = theme ? parseInt(theme) : 0;

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

  function openPreview(image) {
    setmodelOpen(true);
    setImgPrev(image);
    console.log('modelOpen');
  }


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
                loading='auto'
                src={item.context}
                alt="context message"
                onClick={() => {                  
                  openPreview(item.context);
                }}
              />
              <p className="textTimeRight">
                {moment(Number(item.timestamp)).fromNow()}
              </p>
            </div>
          )
        }
        else {
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
                    loading='auto'
                    src={image}
                    srcSet={item.context}
                    onClick={() => {
                      openPreview(item.context);
                    }}
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

;

  function renderStickers() {
    return (
      <div className="viewStickers">
        <img
          className="imgSticker"
          src={images.heart}
          alt="sticker"
          onClick={() => onSendMessage('heart', 2)}
        />
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
      <IonHeader className={` ${themes[selectedTheme]}-header`} >
        <IonToolbar className={`chattoolbar ${themes[selectedTheme]}-header`}>
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
        
        <IonProgressBar hidden={!loading} type='indeterminate' ></IonProgressBar >
        <div className="userAddBlock" hidden>
          <IonButton >Add</IonButton> <IonButton>Block</IonButton>

          </div>

      </IonHeader>
      <IonContent className={themes[selectedTheme]}>
        
          
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
       <ImagePreview img={imgPrev} modelOpen={modelOpen} setModelOpen={setmodelOpen} />
        <IonPopover isOpen={showPopover.open}
          event={showPopover.event}
          onDidDismiss={e => setShowPopover({ open: false, event: undefined })}>
          <IonList >
            <IonItem lines='none' routerLink={ROUTE.theme}>Themes</IonItem>
            <IonItem lines='none' onClick={() => {
              removeFriend(peerUser.id);
              setShowPopover(false)
              createToast('User Delete', 'danger');
            }}>Delete </IonItem>
          </IonList>
        </IonPopover>
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
