import React, { useRef, useContext, useState } from 'react'
import './videochat.css'
import { IonPage, IonContent, useIonViewDidEnter, IonFab, IonFabButton, IonIcon, IonFabList, useIonViewWillEnter, IonText, IonItem, IonLabel, IonInput, IonButton, useIonViewDidLeave } from '@ionic/react'
import { FirebaseContext } from '../context/FirebaseContext';
import {  caretUp, camera, call, exit, addCircle } from 'ionicons/icons';
import Peer from 'peerjs';
import { useTabHide } from '../config/hooks';

let remoteStream;
let peer;

let localPeerConnection;
let remotePeerConnection;


const VideoChat = ({ match }) => {
    let peerID = match.params.id;
    console.log(peerID);

    const firebase = useContext(FirebaseContext);
    const [id, setId] = useState();
    const [currentCall, setcurrentCall] = useState()
    const [localStream, setLocalStream] = useState()
    const [header, setHeader] = useState('Video Chat')
    let myId = localStorage.getItem('id')


    let startTime = null;

    const localVideo = useRef(HTMLVideoElement);
    const remoteVideo = useRef();
    const callButton = useRef();
    const startButton = useRef();
    const hangupButton = useRef();


    useIonViewDidLeave(() => {
        const tabbar = document.querySelector("ion-tab-bar");
        tabbar.classList.toggle('ion-hide', false);
    })
    
    useIonViewWillEnter(() => {

        const tabbar = document.querySelector("ion-tab-bar");
        tabbar.classList.toggle('ion-hide', true); 
        window.onclose = () => peer.destroy();
        
        peer = new Peer(myId);


        peer.on('open', (id) => {
            setId(id);
        })

        peer.on('error', (err) => {
            console.log(err);
            localStream.forEach(function (track) {
                if (track.readyState == 'live') {
                    track.stop()
                }
            });
            
        })


        // handle incoming connection

        peer.on('connection', (connection) => {
            console.log('incoming connection', connection);
            connection.on('data', (data) => {
                console.log('data', data);
            })
            connection.on('open', () => {
                connection.send('hello! from receiver...');
            });
        })

        // handle incoming video connection
        peer.on('call', call => {
            setcurrentCall(call)

            console.log('getting call',currentCall);
            navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            }).then(stream => {

                setLocalStream(stream);

                call.answer(stream);
                localVideo.current.srcObject = stream;

                call.on('stream', renderVideo);

                call.on('close', () => {
                    console.log('call disconnected / closed.');
                   
                })

                call.on('error', err => console.log(err));
            }).catch((err) => {
                console.log('Failed to render video stream: ', err);
            })


        })

        peer.on('disconnected', (s) => {
            console.log('disconnected from peer:' + s);
        })

        peer.on('close', (s) => {
            console.log('connection closed: ', s);

        })

    })

    


    // initiate outgoing connection

    function connectTo(peerId) {
        console.log('connecting to ', peerId);

        let connection = peer.connect(peerId);
        connection.on('data', (data) => {
            console.log('data received', data);
        });

        connection.on('open', () => {
            connection.send('hi calling initiate from ' + myId);
        });

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {

            localVideo.current.srcObject = stream;

            let call = peer.call(peerId, stream);
            call.on('stream', renderVideo);
        }).catch(err => console.log('Error getting : ' + err))
    }

    function renderVideo(stream) {
        remoteVideo.current.srcObject = stream;
    }


        return (
            <IonPage>
                <IonContent className='ion-padding' fullscreen >
                    <h1>{header}</h1>
                    <br />
                    <div id='box'>
                        <video id='remoteVideo' ref={remoteVideo} autoPlay playsInline ></video>
                        <video id='localVideo' ref={localVideo} autoPlay muted ></video>
                </div>

                    <form onSubmit={(e) => {
                        e.preventDefault()
                        connectTo(peerID)
                    }}>
                        
                      
                        <IonButton id='callbtn' color='success' ref={callButton} fill='clear' shape='round' type='submit' onClick={() => { console.log(peerID) }}>
                                <IonIcon icon={call} />
                            </IonButton>

                        <IonButton id='hangbtn' color='danger' fill='clear' shape='round' ref={hangupButton} onClick={() => {
                            console.log('call ' + currentCall);
                            if (currentCall) { 
                                currentCall.close();
                                }
                            }}>
                                <IonIcon icon={exit} />
                            </IonButton>
                        <IonText color='light' id='peerID'>{id}</IonText>


                    </form>

                
                
                </IonContent>
            
            </IonPage>
        )
    }

export default VideoChat


// Define helper functions.



// Gets the "other" peer connection.
function getOtherPeer(peerConnection) {
  return (peerConnection === localPeerConnection) ?
      remotePeerConnection : localPeerConnection;
}

// Gets the name of a certain peer connection.
function getPeerName(peerConnection) {
  return (peerConnection === localPeerConnection) ?
      'localPeerConnection' : 'remotePeerConnection';
}

// Logs an action (text) and the time when it happened on the console.
function tracking(text) {
  text = text.trim();
  const now = (window.performance.now() / 1000).toFixed(3);

  console.log(now, text);
}