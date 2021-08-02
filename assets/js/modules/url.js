export default class UrlManager{
    static apiKey           = "e4433d2b7999e8a413911398114ca617";
    static homeUrl          = `https://api.openweathermap.org/data/2.5`;
}

UrlManager.prototype.createUrl = (domain,keys = [], values = []) => {
    let paramsVal = "";
    for(let i = 0; i < keys.length && values.length; i++){
        paramsVal += `&${keys[i]}=${values[i]}`;
    }
    return UrlManager.homeUrl + `/${domain}?appid=${UrlManager.apiKey}${paramsVal}`;
}
