let imgUrlPath = 'node.display_url';
let captionPath = 'node.edge_media_to_caption.edges'
let ownerPath = 'node.owner.username'
let timePath = 'node.taken_at_timestamp'
let isVideoPath = 'node.is_video'
let nodePath = 'graphql.user.edge_owner_to_timeline_media.edges'
let shortCodePath = 'node.shortcode'

function mapDataList(arr) {
    return arr.map(async (node, i) => {
        let x = path(node, captionPath)[0].node.text;
        let shortcode = path(node, shortCodePath)
        let isVideo = path(node, isVideoPath);
        // console.log(i+1, x);
        let obj = {
            i: i + 1,
            imgUrl: path(node, imgUrlPath),
            caption: x,
            owner: path(node, ownerPath),
            timestamp: path(node, timePath),
            isVideo,
            shortcode,
        };

        if (isVideo) {
            console.log('gettg video data');
            
            return await getVideoUrl(shortcode).then(({ dash_info, videoUrl }) => {
                let obj1 = {
                    i: i + 1,
                    imgUrl: path(node, imgUrlPath),
                    caption: x,
                    owner: path(node, ownerPath),
                    timestamp: path(node, timePath),
                    isVideo,
                    shortcode, dash_info, videoUrl
                };
                // console.log(obj1);
                

                return obj1
            })
        }

        return obj

    })
}

export async function instaFeed(user_name) {
    let url = `https://www.instagram.com/${user_name}/?__a=1&max_id=$max`;


    const response = await fetch(url);
    const json = await response.json();
    const arr = path(json, nodePath);


    const pList = mapDataList(arr)
    const data = await Promise.all(pList)
    console.log(data);
    return data;
}

export function instaFeedBYHashTag(hashtag = 'quotes', endpoint = '') {

    const url = `https://www.instagram.com/graphql/query/?query_hash=3e7706b09c6184d5eafd8b032dbcf487&variables={"tag_name":"${hashtag}","first":10 ,"after":"${endpoint}"}`;
    console.log(url);
    
    const response = fetch(url).then(res => res.json()).then(async (json) => {
        console.log(json);
        
        const nextEndpoint = path(json, 'data.hashtag.edge_hashtag_to_media.page_info.end_cursor')

        const arr = path(json, 'data.hashtag.edge_hashtag_to_media.edges');
        const pList = mapDataList(arr)
        const data = await Promise.all(pList)
        console.log(data);
        return { data, nextEndpoint };
    })
    // const json = await response.json();
    // console.log(json);

   return response
}

function getVideoUrl(shortcode) {
    let url = `https://www.instagram.com/p/${shortcode}/?__a=1`;
    const response = fetch(url).then(res => res.json()).then(json => {
        let dash_info = path(json, 'graphql.shortcode_media.dash_info')
        let videoUrl = path(json, 'graphql.shortcode_media.video_url')
        // console.log(dash_info, videoUrl);
        return {dash_info, videoUrl}
    })
    return response
}

/**
 * Retrieve nested item from object/array
 * @param {Object|Array} obj
 * @param {String} path dot separated
 * @param {*} def default value ( if result undefined )
 * @returns {*}
 */
function path(obj, path, def) {
    var i, len;

    for (i = 0, path = path.split('.'), len = path.length; i < len; i++) {
        if (!obj || typeof obj !== 'object') return def;
        obj = obj[path[i]];
    }

    if (obj === undefined) return def;
    return obj;
}