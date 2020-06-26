let imgUrlPath = 'node.display_url';
let captionPath = 'node.edge_media_to_caption.edges'
let ownerPath = 'node.owner.username'
let timePath = 'node.taken_at_timestamp'
let node = 'graphql.user.edge_owner_to_timeline_media.edges'

export async function instaFeed(user_name) {
    let url = `https://www.instagram.com/${user_name}/?__a=1&max_id=$max`;


    const response = await fetch(url);
    const json = await response.json();
    const arr = path(json, node);
    const dataArr = arr.map(data => {

        let obj = {
            imgUrl: path(data, imgUrlPath),
            owner: path(data, ownerPath),
            timestamp: path(data, timePath),
            caption: eval(captionPath),
        };

        return obj
    })
    console.log(dataArr);
    return dataArr;
}

export function instaFeedBYHashTag(hashtag = 'quotes', endpoint = '') {

    const url = `https://www.instagram.com/graphql/query/?query_hash=3e7706b09c6184d5eafd8b032dbcf487&variables={"tag_name":"${hashtag}","first":10 ,"after":"${endpoint}"}`;
    console.log(url);
    
    const response = fetch(url).then(res => res.json()).then(json => {
        console.log(json);
        
        const nextEndpoint = path(json, 'data.hashtag.edge_hashtag_to_media.page_info.end_cursor')

        const arr = path(json, 'data.hashtag.edge_hashtag_to_media.edges');
        const data = arr.map((node, i) => {
            let x = path(node, captionPath)[0].node.text;
            // console.log(i+1, x);
            
            
            let obj = {
                i: i+1,
                imgUrl: path(node, 'node.display_url'),
                caption: x,
                owner: path(node, ownerPath),
                timestamp: path(node, timePath),

            };

            return obj

        })
        console.log(data);
        return { data, nextEndpoint };
    })
    // const json = await response.json();
    // console.log(json);

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