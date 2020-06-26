import React, { useEffect, useState } from 'react'
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonInfiniteScroll, IonInfiniteScrollContent, IonList, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonImg, IonItem, IonIcon, IonLabel, IonSlides, IonSlide, IonProgressBar, IonRefresher, IonRefresherContent } from '@ionic/react'
import moment from 'moment';
import { instaFeed, instaFeedBYHashTag } from '../config/feedData';
import { chevronDownCircleOutline } from 'ionicons/icons';
import { createToast } from '../config/hooks';
let endpoint = '';
let tag = ''

// eslint-disable-next-line no-extend-native
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

const Feed = () => {

    const [DataList, setDataList] = useState([])
    const [loadin, setLoadin] = useState(true)

    useEffect(() => {
        fetchData('')
        
    }, [])
    console.log(DataList);
    
    async function fetchData(e) {
        console.log(e);
        
        const hashtags = ['poems', 'love', 'travel', 'feeltheburn', 'latesttech', 'animescreenshot' ,'urban', 'bollywood', 'gaming', 'nature']
        tag = hashtags.random()
        console.log(tag);
        
        try {
            const { data, nextEndpoint } = await instaFeedBYHashTag(tag, endpoint)
            if (e.type === 'ionRefresh') setDataList([...data]) 
            else setDataList(prevData => ([...prevData, ...data]))
            setLoadin(false)
            endpoint = nextEndpoint;
        } catch (error) {
            console.log(error);
            createToast('Error loading', 'warning', 'bottom')
            
        }
        if (e) {
            e.detail && e.detail.complete();

             e.target.complete();
        }
        // return data;
    }


    // instaFeed('thegoodquote');



    const List = () => DataList.map((feed, i) => (

            <IonCard key={i}>
                <IonCardHeader >
                    <IonCardSubtitle>{feed.owner}</IonCardSubtitle>
                    {/* <IonCardTitle>{feed.title}</IonCardTitle> */}
                </IonCardHeader>
                <img loading='auto' alt='' src={feed.imgUrl} />

                <IonCardContent>
                    <p>{moment(feed.timestamp).fromNow()}</p>
                    {feed.caption}
                </IonCardContent>
            </IonCard>

    ))


    return (
        <IonPage >
            <IonHeader>
                <IonToolbar >
                    <IonTitle>Feed</IonTitle>
                </IonToolbar>
                <IonProgressBar hidden={!loadin} type='indeterminate'></IonProgressBar>

            </IonHeader>
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={fetchData}>
                    <IonRefresherContent
                        pullingIcon={chevronDownCircleOutline}
                        pullingText="Pull to refresh"
                        refreshingSpinner="circles"
                        refreshingText="Refreshing...">
                    </IonRefresherContent>
                </IonRefresher>
                
                {/* <IonSlides options={{ direction: 'vertical' }} onIonSlideReachEnd={fetchData} > */}

                    
                        <List />
                {/* </IonSlides> */}

                <IonInfiniteScroll threshold='22%' onIonInfinite={fetchData}>
                    <IonInfiniteScrollContent
                        loadingSpinner='crescent'
                        loadingText='Loading ...' ></IonInfiniteScrollContent>
                </IonInfiniteScroll>
            </IonContent>

        </IonPage>
    )
}

export default Feed
