import { ROUTE, AppString } from '../config/const';
import SkeletonList from '../components/SkeletonList';
import { hashString } from '../config/useChatBox';
import { useContext, useState } from 'react';
import { FirebaseContext } from '../context/FirebaseContext';
import { createToast } from './hooks';


import React from 'react'

export function useFeed() {

    const firebase = useContext(FirebaseContext);
    const [selectedLink, setSelectedLink] = useState(null);



    function sendFeed(users, feed) {
        let currentUser = {
            id: localStorage.getItem(AppString.ID),
            avatar: localStorage.getItem(AppString.PHOTO_URL),
            nickname: localStorage.getItem(AppString.NICKNAME),
        }

        if (users.length > 0) {
            for (const peerUser of users) {
                let chatId;
                if ((peerUser.id).startsWith('G-')) chatId = peerUser.id
                else chatId = (hashString(currentUser.id) <= hashString(peerUser.id)) ? `${currentUser.id}-${peerUser.id}` : `${peerUser.id}-${currentUser.id}`;

                function sendMessage(content, type) {

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
                    }).catch(err => createToast(err.toString()));
                    // setMsg('');

                    if ((peerUser.id).startsWith('G-')) {
                        firebase.user(currentUser.id).collection('groups').doc(peerUser.id).update({
                            lastMsgTime: parseInt(timestamp),
                            lastMsg: msgItem.context
                        })
                        firebase.user(peerUser.id).collection('groups').doc(currentUser.id).update({
                            lastMsgTime: parseInt(timestamp),
                            lastMsg: msgItem.context
                        })
                    } else {

                        firebase.user(currentUser.id).collection('friends').doc(peerUser.id).update({
                            lastMsgTime: parseInt(timestamp),
                            lastMsg: msgItem.context
                        })
                        firebase.user(peerUser.id).collection('friends').doc(currentUser.id).update({
                            lastMsgTime: parseInt(timestamp),
                            lastMsg: msgItem.context
                        })
                    }
                };
                if (feed.isVideo) {
                    sendMessage(feed.videoUrl, 3)
                } else {
                    sendMessage(feed.imgUrl, 1)
                }
                createToast('Send successfully.')
            }


        } else {
            createToast('No user selected', 'warning');
        }

        setSelectedLink(null)
    }

    return { 
        setSelectedLink, selectedLink, sendFeed
    }
}
export const RawHTML = ({ children, className = "" }) => (
    <div className={className}
        dangerouslySetInnerHTML={{ __html: children.replace(/\n/g, '<br />') }} />
)

