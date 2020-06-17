import React from 'react'
import { IonContent, IonItem, IonButton, IonIcon, IonSlides, IonSlide, IonImg, IonModal } from '@ionic/react'
import { close } from 'ionicons/icons'
import './imagePreview.css'

const ImagePreview = ({ img, modelOpen, setModelOpen }) => {

    let slideropts = {
        zoom: { 
            maxRatio: 1
        }
    }

    function imgclose() {
        setModelOpen(false);
    }
    
    return (
        <IonModal isOpen={modelOpen} onDidDismiss={() => { setModelOpen(false) }}>
            <IonContent fullscreen >
                <IonItem lines='none' className='closefake'>
                    <IonButton slot='start' onclick={imgclose} fill='clear' color='dark'>
                        <IonIcon icon={close}></IonIcon>
                    Back
                </IonButton>
                </IonItem>
                <IonSlides options={slideropts} >
                    <IonSlide>
                        <div className="swiper-zoom-container" >
                            <IonImg src={img} />
                        </div>
                    </IonSlide>
                </IonSlides>
            </IonContent>

        </IonModal>
        
    )
}

export default ImagePreview
