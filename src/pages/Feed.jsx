import React, { useEffect, useState } from 'react'
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonInfiniteScroll, IonInfiniteScrollContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonProgressBar, IonRefresher, IonRefresherContent, IonChip, IonLabel, IonSearchbar, IonButtons, IonButton, IonIcon, IonRow, IonCol, useIonViewDidEnter } from '@ionic/react'
import { Player, BigPlayButton } from 'video-react';
import './feed.css'
import "video-react/dist/video-react.css";
import { instaFeedBYHashTag, instaFeedBYUserName } from '../config/feedData';
import { chevronDownCircleOutline, searchCircle } from 'ionicons/icons';
import { createToast } from '../config/hooks';
import { Link } from 'react-router-dom';
import { ROUTE } from '../config/const';
let endpoint = '';
let tag = ''
// eslint-disable-next-line no-extend-native
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

const Feed = ({location, history}) => {
    const [DataList, setDataList] = useState([])
    const [searchShow, setSearchShow] = useState(false)
    const [loadin, setLoadin] = useState(true)
    const hashtags = ['poems', 'desimeme', 'art', 'travel', 'dankmeme', 'feeltheburn', 'latesttech', 'wwe', 'animeme', 'bollywood', 'pubg', 'babes', 'kapilsharma', 'tarakmehtakaultachashma']
    useEffect(() => {
        fetchData({ type: 'first' })
    }, [])
    // console.log(DataList);

    useIonViewDidEnter(() => {
        console.log(history.location);
        setLoadin(true);
        let q = new URLSearchParams(history.location.search).get('q')
        if (q) {
            if (q.startsWith('@')) {
                q = q.replace(/@(\S+)/g, '$1')
                fetchData({ type: 'tagselect' }, q, '@')
            } else {
                fetchData({ type: 'tagselect' }, q)
            }
        }
        
    })


    async function fetchData(e, tagval, type = '#') {
        if (!(e.type === 'ionInfinite')) {
            tag = hashtags.random()
        }

        if (e.type === 'tagselect') {
            tag = tagval;
            endpoint = ''

        }
        console.log(tag);

        try {


            const { data, nextEndpoint } = type === "#" ? await instaFeedBYHashTag(tag, endpoint) : await instaFeedBYUserName(tag, endpoint)
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

            //  use to convert hashtags to links for fetching
            var captions = document.querySelectorAll('#caption')
            // console.log(captions);

            if (captions.length > 0) captions.forEach(function (caption) {

                caption.innerHTML = caption.innerHTML.replace(/#(\S+)/g, '#<span id="linktag" >$1</span>')
                caption.innerHTML = caption.innerHTML.replace(/@(\S+)/g, '@<span id="usertag" >$1</span>')
            })

            var hashlinks = document.querySelectorAll('#linktag');
            // console.log(hashlinks);

            if (hashlinks.length > 0) hashlinks.forEach((linkx) => {
                let linkhash = linkx.innerHTML
                linkx.addEventListener('click', () => {
                    setLoadin(true)
                    // fetchData({ type: 'tagselect' }, linkhash)
                    history.push(ROUTE.feed + '?q=' + linkhash)

                })
            })

            var userlinks = document.querySelectorAll('#usertag');
            // console.log(userlinks);

            if (userlinks.length > 0) userlinks.forEach((linkx) => {
                let linkhash = linkx.innerHTML
                linkx.addEventListener('click', () => {
                    setLoadin(true)
                    // fetchData({ type: 'tagselect' }, linkhash, '@')
                    history.push(ROUTE.feed + '?q=@' + linkhash)

                })
            })


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



    const List = () => DataList.map((feed, i) => {
        return (
            <IonCol key={i} size='12' sizeSm sizeMd='4'>

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
                        <p id='caption'>{feed.caption}</p>
                    </IonCardContent>
                </IonCard>

            </IonCol>

        )
    })


    return (
        <IonPage >
            <IonHeader>
                <IonToolbar >
                    <IonTitle>Feed - {tag}</IonTitle>
                    <IonButtons slot='end'>
                        <IonButton hidden={searchShow} color='dark' expand='full' onClick={() => { setSearchShow(true) }}>
                            <IonIcon icon={searchCircle} />
                        </IonButton>
                        <IonSearchbar hidden={!searchShow} animated onIonChange={e => {
                            let q = (e.detail.value).toLowerCase().trim();
                            if (q) {
                                console.log(q)
                                history.push(ROUTE.feed + '?q='+q)
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
                        <Link to={ROUTE.feed + '?q='+tag} className="tag" key={i}><IonChip onClick={() => {
                            setLoadin(true)

                        }}> <IonLabel>{tag}</IonLabel>  </IonChip></Link>
                    ))
                }</div>

                {/* <IonSlides options={{ direction: 'vertical' }} onIonSlideReachEnd={fetchData} > */}

                <IonRow>
                    <List />
                </IonRow>
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
