let imgUrlPath = 'node.display_url';
let captionPath = 'node.edge_media_to_caption.edges'
let ownerPath = 'node.owner.username'

export async function instaFeed(user_name) {
    let url = `https://www.instagram.com/${user_name}/?__a=1&max_id=$max`;
    let node = 'graphql.user.edge_owner_to_timeline_media.edges'


    const response = await fetch(url);
    const json = await response.json();
    const arr = path(json, node);
    const data = arr.map(node => {

        let obj = {
            imgUrl: path(node, imgUrlPath),
            caption: path(node, captionPath)[0].node.text,
            owner: path(node, ownerPath)
        };

        return obj
    })
    console.log(data);
    return data;
}

export async function instaFeedBYHashTag(hashtag='quotes', endpoint='') {
    
    const url = `https://www.instagram.com/graphql/query/?query_hash=3e7706b09c6184d5eafd8b032dbcf487&variables={"tag_name":"${hashtag}","first":20 ,"after":"${endpoint}"}`;

    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
    
    const nextEndpoint = path(json, 'data.hashtag.edge_hashtag_to_media.page_info.end_cursor')

    const arr = path(json, 'data.hashtag.edge_hashtag_to_media.edges');
    const data = arr.map(node => {

        if (node) {
            let obj = {
                imgUrl: path(node, 'node.display_url'),
                caption: path(node, captionPath)[0].node.text,
                owner: path(node, ownerPath),
            };

            return obj
        }
        return {};
    })
    console.log(data);
    return {data, nextEndpoint};
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