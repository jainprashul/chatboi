import React, { useRef, useContext, useState } from 'react'
import './videochat.css'
import { IonPage, IonContent, useIonViewDidEnter, IonFab, IonFabButton, IonIcon, IonFabList, useIonViewWillEnter, IonText, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react'
import { FirebaseContext } from '../context/FirebaseContext';
import {  caretUp, camera, call, exit, addCircle } from 'ionicons/icons';
import Peer from 'peerjs';

let localStream;
let remoteStream;
let peer;

let localPeerConnection;
let remotePeerConnection;


const VideoChat = ({ match }) => {
    let peerID = match.params.id;
    console.log(peerID);

    const firebase = useContext(FirebaseContext);
    const [id, setId] = useState('');
    const [inputID, setInputID] = useState('')
    let myId = localStorage.getItem('id')
    let currentCall;


    let startTime = null;

    const localVideo = useRef();
    const remoteVideo = useRef();
    const callButton = useRef();
    const startButton = useRef();
    const hangupButton = useRef();


    useIonViewWillEnter(() => {
        peer = new Peer(myId);


        peer.on('open', (id) => {
            setId(id);
        })

        peer.on('error', (err) => {
            console.log(err);
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
            currentCall = call;
            navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            }).then(stream => {
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
                <IonContent fullscreen >
                    <h1>Video Chat</h1>
                    <span id="currentRoom"></span>
                    <span>{id}</span>
                    <br />
                    <video ref={localVideo} autoPlay playsInline ></video>
                    <video ref={remoteVideo} autoPlay playsInline ></video>

                    <form onSubmit={(e) => {
                        e.preventDefault()
                        connectTo(peerID)
                    }}>
                        {/* <IonItem>
                        <IonLabel position='stacked'>connection Id</IonLabel>
                        <IonInput required placeholder="id" value={inputID} type='text' onIonChange={(e) => setInputID(e.target.value)} ></IonInput>
                    </IonItem> */}
                      
                            <IonButton color='light' ref={callButton} type='submit' onClick={() => { console.log(peerID) }}>
                                <IonIcon icon={call} />
                            </IonButton>

                            <IonButton color='light' fill='clear' disabled={!currentCall} ref={hangupButton} onClick={() => {
                                if (currentCall) {
                                    currentCall.close().then(() => { console.log('call disconnected'); });

                                }
                            }}>
                                <IonIcon icon={exit} />
                            </IonButton>
                  

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