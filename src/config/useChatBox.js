import { FirebaseContext } from "../context/FirebaseContext";
import { useContext, useState, useEffect } from "react";
import { AppString , images, ting} from "./const";
import { createToast, compressImage } from "./hooks";

let removeListener = null;
// let listMessage = []
let currentPhotoFile = null;
let chatId = null;
export function useChatBox(peerUser, setMsg, setListMessage) {
    let currentUser = {
        id: localStorage.getItem(AppString.ID),
        avatar: localStorage.getItem(AppString.PHOTO_URL),
        nickname: localStorage.getItem(AppString.NICKNAME),
    }
    const firebase = useContext(FirebaseContext);
    const [loading, setLoading] = useState(false);
    const [showStickers, setShowStickers] = useState(false);


    
    
    function isGroupChat() {
        return (peerUser.id).startsWith('G-');
    }

    async function getMsgHistory() {
        console.log('peerUser: ', (peerUser));  
        
        if (removeListener) {
            removeListener();
        }

        // listMessage.length = 0
        let msgList = []
        setLoading(true);
        if(isGroupChat()) chatId = peerUser.id
        else chatId = (hashString(currentUser.id) <= hashString(peerUser.id)) ? `${currentUser.id}-${peerUser.id}` : `${peerUser.id}-${currentUser.id}`;
        console.log(chatId);

        removeListener = firebase.message(chatId).onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === AppString.DOC_ADDED) {
                    // msgList.push(change.doc.data());
                    let data = change.doc.data();

                    msgList.push(data);

                    // let audio = new Audio(ting);
                    // audio.play();

                }
            })
            setListMessage(msgList)
            setMsg(' ')
            setMsg('')
            // console.log('listener', listMessage);
            
            setLoading(false);
            // RenderListMessage();
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
  * @type type 3 = videos 
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
            From: currentUser.nickname,
            To: peerUser.nickname,
            timestamp,
            context: content.trim(),
            type
        }
        // console.log(groupChatId, timestamp);
        firebase.message(chatId).doc(timestamp).set(msgItem).then(() => {
            setMsg('')
        }).catch(err => createToast(err.toString()));
        // setMsg('');

        if (!isGroupChat()) {
            firebase.user(currentUser.id).collection('friends').doc(peerUser.id).update({
                lastMsgTime: parseInt(timestamp),
                lastMsg: msgItem.context
            })
            firebase.user(peerUser.id).collection('friends').doc(currentUser.id).update({
                lastMsgTime: parseInt(timestamp),
                lastMsg: msgItem.context
            })
        } else {
            firebase.user(currentUser.id).collection('groups').doc(peerUser.id).update({
                lastMsgTime: parseInt(timestamp),
                lastMsg: msgItem.context
            })
            firebase.user(peerUser.id).collection('groups').doc(currentUser.id).update({
                lastMsgTime: parseInt(timestamp),
                lastMsg: msgItem.context
            })
        }
    };

    function uploadPhoto() {
        if (currentPhotoFile) {
            const timestamp = (Date.now()).toString();

            const uploadTask = firebase.storage.ref(`${AppString.CHATBOX_SHARED}/${chatId}`).child(timestamp).put(currentPhotoFile);
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

    function onChoosePhoto(e) {
        if (e.target.files && e.target.files[0]) {
            setLoading(true);
            compressImage(e.target.files).then(({ photo, info }) => {
                currentPhotoFile = photo.data
                // currentPhotoFile = (e.target.files[0]);
                // Check this file is an image?
                const prefixFiletype = photo.type
                if (prefixFiletype.indexOf(AppString.PREFIX_IMAGE) === 0) {
                    uploadPhoto();
                } else {
                    setLoading(false)
                    createToast('This file is not an image');
                }
            })          
        }
        else {
            setLoading(false);
        }
    };

    const getGifImage = value => {
        switch (value) {
            case 'heart':
                return images.heart
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
    
    return {
        loading,
        getMsgHistory,
        removeListener,
        openListSticker,
        showStickers,
        onSendMessage,
        onChoosePhoto,
        getGifImage, isGroupChat
    }
}


export function hashString(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
        hash = hash & hash // Convert to 32bit integer
    }
    return hash
}