import React, { useEffect, useState } from 'react'
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonInfiniteScroll, IonInfiniteScrollContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonProgressBar, IonRefresher, IonRefresherContent, IonChip, IonLabel, IonSearchbar, IonButtons, IonButton, IonIcon } from '@ionic/react'
import { Player, BigPlayButton } from 'video-react';
import './feed.css'
import "video-react/dist/video-react.css";
import { instaFeedBYHashTag } from '../config/feedData';
import { chevronDownCircleOutline, searchCircle, openOutline } from 'ionicons/icons';
import { createToast } from '../config/hooks';
let endpoint = '';
let tag = ''
// eslint-disable-next-line no-extend-native
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

const Feed = () => {
    const [DataList, setDataList] = useState([])
    const [searchShow, setSearchShow] = useState(false)
    const [loadin, setLoadin] = useState(true)
    const hashtags = ['poems', 'desimeme', 'art', 'travel', 'dankmeme', 'feeltheburn', 'latesttech', 'wwe', 'animeme', 'bollywood', 'pubg', 'babes', 'kapilsharma', 'tarakmehtakaultachashma']
    useEffect(() => {
        fetchData({ type: 'first' })
    }, [])
    // console.log(DataList);


    async function fetchData(e, tagval) {
        if (!(e.type === 'ionInfinite')) {
            tag = hashtags.random()
        }

        if (e.type === 'tagselect') tag = tagval
        console.log(tag);

        try {
            const { data, nextEndpoint } = await instaFeedBYHashTag(tag, endpoint)
            // const data = await tiktokFeed()
            if (e.type === 'ionRefresh' || (e.type === 'tagselect')) setDataList([...data])
            else setDataList(prevData => ([...prevData, ...data]))
            setLoadin(false)
            endpoint = nextEndpoint;

            //plsy 
            var medias = Array.prototype.slice.apply(document.querySelectorAll('audio,video'));
            medias.forEach(function (media) {
                media.addEventListener('play', function (event) {
                    medias.forEach(function (media) {
                        if (event.target != media) media.pause();
                    });
                });
            });

        } catch (error) {
            console.log(error);
            setLoadin(false)
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

            ) : (
                    <img loading='auto' alt='Content' src={feed.imgUrl} />
                )}

            <IonCardContent>
                {/* <p>
                    <IonButton color='light' slot='end' onClick={()=> {}}>
                        <IonIcon icon={openOutline} />
                    </IonButton>
                </p> */}
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
                    <IonButtons slot='end'>
                        <IonButton hidden={searchShow} color='dark' expand='full' onClick={() => { setSearchShow(true) }}>
                            <IonIcon icon={searchCircle} />
                        </IonButton>
                        <IonSearchbar hidden={!searchShow} animated onIonChange={e => {
                            let q = (e.detail.value).toLowerCase().trim();
                            if (q) {
                                console.log(q)
                                setLoadin(true)
                                fetchData({ type: 'tagselect' }, q)
                            }

                        }} showCancelButton={"focus"} onIonCancel={e => setSearchShow(false)} debounce={1000}></IonSearchbar>
                    </IonButtons>
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
                        <div className="tag" key={i}><IonChip onClick={() => {
                            setLoadin(true)
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
