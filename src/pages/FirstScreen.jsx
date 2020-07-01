/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import { IonPage, IonContent,IonButton } from '@ionic/react'
import { logo, ROUTE, AppString } from '../config/const'
import './firstScreen.css'
import { useTabHide } from '../config/hooks'

const FirstScreen = () => {
    useTabHide();
    return (
        <IonPage>
            <IonContent fullscreen className='ion-padding ion-text-center'>
                <br/><br/>
                <br/><br/>    
                <h2 className='welcome'>Welcome to</h2>
                <h1 className='appname'>{AppString.APP_NAME}</h1>
                <br/>
                <img alt='' src={logo} className="avatar" />
                <p>Now Fun Is Simple N Secure <span role='img'>❤️</span></p>
                <IonButton routerLink={ROUTE.signin}>Get started</IonButton>
            </IonContent>
        </IonPage>
    )
}

export default FirstScreen
