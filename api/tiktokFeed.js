
const TikTokScraper = require('tiktok-scraper');


async function dataTik() {
    try {
        const posts = await TikTokScraper.trend('', { number: 100 });
        console.log(posts);
        return posts;
    } catch (error) {
        console.log(error);
    }
}


module.exports = (request, response) => {

    dataTik().then(res => {
        // console.log(res);
        const data = res.collector.map((node, i) => {
            return {
                i: i + 1,
                imgUrl : node.covers.default,
                caption: node.text,
                owner: node.authorMeta.nickName,
                timestamp : node.createTime,
                isVideo: true,
                videoUrl: node.videoUrl
            }
        })
        response.send(data)
        

    })


}


