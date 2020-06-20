import React from 'react'
import { IonContent } from '@ionic/react'
import './loadingScreen.css'
import { useTabHide } from '../config/hooks'
import { images } from '../config/const'

const LoadingScreen = () => {

    useTabHide()
    return (
        <>
            <IonContent >
                <div className="center"></div>
                {/* <img src={images.mimi2} alt="" /> */}

                <div className="sk-folding-cube">
                    <div className="sk-cube1 sk-cube"></div>
                    <div className="sk-cube2 sk-cube"></div>
                    <div className="sk-cube4 sk-cube"></div>
                    <div className="sk-cube3 sk-cube"></div>
                </div>

            </IonContent>
        </>
    )
}

export default LoadingScreen
