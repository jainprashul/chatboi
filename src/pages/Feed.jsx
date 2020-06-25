import React, { useEffect, useState } from 'react'
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonInfiniteScroll, IonInfiniteScrollContent, IonList, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonImg, IonItem, IonIcon, IonLabel } from '@ionic/react'
import moment from 'moment';
import { wifi, wine, warning, walk } from 'ionicons/icons';
let data = [];
let page = 0;
const apiKey = '153a1cd270064dbc89c62240fc8d8981';
const Feed = () => {



    const [DataList, setDataList] = useState([])

    useEffect(() => {
        fetchData('')
    }, [])

    function fetchData(e) {

        page++;
        fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}&pageSize=15&page=${page}`).then(res => res.json())
            .then(json => {
                console.log(json);
                data = json.articles
                setDataList(prevData => ([...prevData, ...data]))
                if (e) {
                    e.target.complete();
                    if (DataList.length >= json.totalResults) {
                        e.target.disabled = true;
                    }
                }
            })
    }


    const List = () => DataList.map((feed, i) => (

        <IonCard key={i}>
            <IonCardHeader routerLink={feed.url}>
                <IonCardSubtitle>{feed.author}</IonCardSubtitle>
                <IonCardTitle>{feed.title}</IonCardTitle>
            </IonCardHeader>
            <IonImg src={feed.urlToImage} />

            <IonCardContent>
                <p>{moment(feed.publishedAt).fromNow()}</p>
                {feed.description}
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
               
                <List />
                <IonInfiniteScroll threshold='25%' onIonInfinite={fetchData}>
                    <IonInfiniteScrollContent
                        loadingSpinner='crescent'
                        loadingText='Loading ...' ></IonInfiniteScrollContent>
                </IonInfiniteScroll>
            </IonContent>
            
        </IonPage>
    )
}

export default Feed
