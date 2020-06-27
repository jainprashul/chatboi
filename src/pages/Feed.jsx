import React, { useEffect, useState } from 'react'
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonInfiniteScroll, IonInfiniteScrollContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonProgressBar, IonRefresher, IonRefresherContent, IonChip, IonLabel } from '@ionic/react'
import { Player, BigPlayButton } from 'video-react';
import './feed.css'
import "video-react/dist/video-react.css"; 
import { instaFeedBYHashTag } from '../config/feedData';
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
    const hashtags = ['poems', 'travel', 'feeltheburn', 'latesttech', 'animescreenshot', 'urban', 'bollywood', 'pubg', 'kapilsharma', 'tarakmehtakaultachashma']
    useEffect(() => {
        fetchData({type: 'first'})
        
    }, [])
    // console.log(DataList);
    
    
    async function fetchData(e, tagval) {
        console.log(e);
        
        
        if (!(e.type === 'ionInfinite')) {
            tag = hashtags.random()
        }

        if (e.type === 'tagselect') tag = tagval
        console.log(tag);

        
        try {
            const { data, nextEndpoint } = await instaFeedBYHashTag(tag, endpoint)
            if (e.type === 'ionRefresh' || (e.type === 'tagselect')) setDataList([...data]) 
            else setDataList(prevData => ([...prevData, ...data]))
            setLoadin(false)
            endpoint = nextEndpoint;
        } catch (error) {
            console.log(error);
            createToast('Error loading', 'warning', 'bottom')
            
        }
        if (!(e.type === 'first')) {
            e.detail && e.detail.complete();

            e.target && e.target.complete();
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
            {feed.isVideo ? (
                <Player
                    playsInline
                    poster={feed.imgUrl}
                    src={feed.videoUrl}
                >
                    <BigPlayButton position="center" />
                </Player>
               
            ): (
                <img loading = 'auto' alt = 'Content' src = {feed.imgUrl} />
                )}

                <IonCardContent>
                    {/* <p>{moment(feed.timestamp).fromNow()}</p> */}
                <p>{feed.caption}</p>
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
                <div className='tags'>{
                    hashtags.map((tag, i) => (
                        <div className="tag"><IonChip key={i} onClick={() => {
                            fetchData({ type: 'tagselect' }, tag)
                            
                        }}> <IonLabel>{tag}</IonLabel>  </IonChip></div>
                    ))
                }</div>
                
                {/* <IonSlides options={{ direction: 'vertical' }} onIonSlideReachEnd={fetchData} > */}

                
                        <List />
                {/* </IonSlides> */}

                <IonInfiniteScroll threshold='1000px' onIonInfinite={fetchData}>
                    <IonInfiniteScrollContent
                        loadingSpinner='crescent'
                        loadingText='Loading ...' ></IonInfiniteScrollContent>
                </IonInfiniteScroll>
            </IonContent>

        </IonPage>
    )
}

export default Feed
