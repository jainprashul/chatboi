import React from 'react'
import { IonItem, IonSkeletonText, IonAvatar, IonLabel } from '@ionic/react'

const SkeletonList = () => (
    <>
        <IonItem>
            <IonAvatar slot="start">
                <IonSkeletonText animated />
            </IonAvatar>
            <IonLabel>
                <h3>
                    <IonSkeletonText animated style={{ width: '50%' }} />
                </h3>
                <p>
                    <IonSkeletonText animated style={{ width: '80%' }} />
                </p>
            </IonLabel>
        </IonItem>
        <IonItem>
            <IonAvatar slot="start">
                <IonSkeletonText animated />
            </IonAvatar>
            <IonLabel>
                <h3>
                    <IonSkeletonText animated style={{ width: '50%' }} />
                </h3>
                <p>
                    <IonSkeletonText animated style={{ width: '80%' }} />
                </p>
            </IonLabel>
        </IonItem><IonItem>
            <IonAvatar slot="start">
                <IonSkeletonText animated />
            </IonAvatar>
            <IonLabel>
                <h3>
                    <IonSkeletonText animated style={{ width: '50%' }} />
                </h3>
                <p>
                    <IonSkeletonText animated style={{ width: '80%' }} />
                </p>
            </IonLabel>
        </IonItem><IonItem>
            <IonAvatar slot="start">
                <IonSkeletonText animated />
            </IonAvatar>
            <IonLabel>
                <h3>
                    <IonSkeletonText animated style={{ width: '50%' }} />
                </h3>
                <p>
                    <IonSkeletonText animated style={{ width: '80%' }} />
                </p>
            </IonLabel>
        </IonItem>
    </>
)

export default SkeletonList
