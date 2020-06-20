import React from 'react'
import { IonPage, IonHeader, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonToolbar, useIonViewDidEnter } from '@ionic/react'
import { themes } from '../config/const';
import './themes.css'
import { useTabHide } from '../config/hooks';

const Themes = ({history}) => {
    
    useTabHide()

    useIonViewDidEnter(() => {
        const tabbar = document.querySelector("ion-tab-bar");
        tabbar.classList.toggle('ion-hide', true);
    })
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Select Theme</IonTitle>

                </IonToolbar>
            </IonHeader>
            <IonContent >
                <IonGrid>
                    <IonRow> { 
                            themes.map((theme, i) => (
                                <IonCol key={i} size='6'>
                                    <div onClick={() => {
                                        localStorage.setItem('ctheme', i);
                                        history.goBack()
                                    }} className={`previewTheme ${theme}`} >
                                        {/* <span className='themeName'>{theme}</span> */}
                                    </div>
                                </IonCol>
                            ))}
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default Themes
