import React, { useEffect, useState } from 'react'
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonInfiniteScroll, IonInfiniteScrollContent, IonList, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonImg, IonItem, IonIcon, IonLabel, IonSlides, IonSlide } from '@ionic/react'
import moment from 'moment';
import { instaFeed, instaFeedBYHashTag } from '../config/feedData';
let endpoint = '';
let page = 0;
const Feed = () => {



    const [DataList, setDataList] = useState([])

    useEffect(() => {
        fetchData('')
    }, [])

    async function fetchData(e) {

        // page++;
        // fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}&pageSize=15&page=${page}`).then(res => res.json())
        //     .then(json => {
        //         console.log(json);
        //         data = json.articles
        //         setDataList(prevData => ([...prevData, ...data]))
        //         if (e) {
        //             e.target.complete();
        //             if (DataList.length >= json.totalResults) {
        //                 e.target.disabled = true;
        //             }
        //         }
        //     })
        const { data, nextEndpoint } = await instaFeedBYHashTag('nature', endpoint)
        setDataList(prevData => ([...prevData, ...data]))
        endpoint = nextEndpoint;
        // if (e) {
        //     e.target.complete();
        // }
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
                    {/* <p>{moment(feed.publishedAt).fromNow()}</p> */}
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
            </IonHeader>
            <IonContent>
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
