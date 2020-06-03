import { FirebaseContext } from "../context/FirebaseContext";
import { useContext, useState, useEffect } from "react";
import { AppString , images} from "./const";
import { createToast } from "./hooks";

let removeListener = null;
// let listMessage = []
let currentPhotoFile = null;
let groupChatId = null;
export function useChatBox(peerUser, setMsg) {
    let currentUser = {
        id: localStorage.getItem(AppString.ID),
        avatar: localStorage.getItem(AppString.PHOTO_URL),
        nickname: localStorage.getItem(AppString.NICKNAME),
    }
    const firebase = useContext(FirebaseContext);
    const [listMessage, setListMessage] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showStickers, setShowStickers] = useState(false);


    useEffect(()=>{
        getMsgHistory()
    },[])

    async function getMsgHistory() {
        console.log('peerUser: ', (peerUser));  
        
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
                    // msgList.push(change.doc.data());
                    let data = change.doc.data();
                    // console.log(data);

                    msgList.push(data);
                }
            })
            setListMessage(msgList);
            // setMsg('')
            console.log('listening');
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
        firebase.message(groupChatId).doc(timestamp).set(msgItem).then(() => {
            setMsg('')
        }).catch(err => createToast(err.toString()));
        // setMsg('');
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
    
    return {
        loading,
        getMsgHistory,
        removeListener,
        listMessage,
        openListSticker,
        showStickers,
        onSendMessage,
        onChoosePhoto,
        getGifImage
    }
}


function hashString(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
        hash = hash & hash // Convert to 32bit integer
    }
    return hash
}