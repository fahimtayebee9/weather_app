export default class ApiManager{
    static fetchData = async function(url){
        const response = await fetch(url);
        if(response.status == 200){
            var data = await response.json();
            return data;
        }
    }

    static weatherIcons = [
        {
            imgUrl  : "assets/img/sun.png",
            ids     : [800],
            vidUrl  : "assets/media/sunny_day.mp4",
        },
        {
            imgUrl  : "assets/img/darkcloud-2.png",
            vidUrl  : "assets/media/cloudy_day.mp4",
            ids     : [803,804],
        },
        {
            imgUrl  : "assets/img/sun-smallCloud.png",
            ids     : [801],
            vidUrl  : "assets/media/cloudy_day.mp4",
        },
        {
            imgUrl  : "assets/img/sun-smallCloud.png",
            ids     : [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
            vidUrl  : "assets/media/rain_vid.mp4",
        },
        {
            imgUrl  : "assets/img/rain-small.png",
            ids     : [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
            vidUrl  : "assets/media/rain_vid.mp4",
        },
        {
            imgUrl  : "assets/img/sun-smallCloud.png",
            ids     : [802],
            vidUrl  : "assets/media/cloudy_day.mp4",
        },
        {
            imgUrl  : "assets/img/rain.png",
            ids     : [300, 301, 302, 310, 311, 312, 313, 314, 321],
            vidUrl  : "assets/media/rain_vid.mp4",
        },
        {
            url     : "assets/img/snow.png",
            ids     : [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
            vidUrl  : "assets/media/snowing.mp4",
        },
        {
            url     : "assets/img/sun-smallCloud.png",
            ids     : [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
            vidUrl  : "assets/media/cloudy_day.mp4",
        },
    ];
}
