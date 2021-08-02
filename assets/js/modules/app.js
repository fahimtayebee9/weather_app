import ApiManager from "./api.js";
import UrlManager from "./url.js";
import Element from "./element.js";
// import Chart from "../../../node_modules/chart.js/auto";
// import Chart from '../../../node_modules/chart.js/auto';
// import { getRelativePosition } from '../../../node_modules/chart.js/helpers';

export default function App() {
    // GETTING REQUIRED ELEMENTS
    const urlManager = new UrlManager();
    App.dateOptions = { weekday: 'long',year: 'numeric', month: 'long', day: 'numeric' };
    App.timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true};
    App.displayCount= true;

    // const chartJs = require('../../../node_modules/chart.js/helpers');

    const fetchData = async (country) => {
        let keys    = ["units", "q", "lang"];
        let values  = ["metric", country, "en"];
        const data      = await ApiManager.fetchData(urlManager.createUrl("weather", keys, values));
        // console.log(forecasts);
        if (data != null) {
            renderCountryWidget(data);
        }
    }

    // FETCH ALL FOR HOME
    const fetchAll = async (latitude, longitude, searchInput) => {
        let keys    = [];
        let values  = [];
        console.log("lat " + latitude + "\nlong " + longitude );
        if(searchInput !== null){
            keys    = ["units", "q", "lang"];
            values  = ["metric", searchInput, "en"];
        }
        else{
            keys    = ["units", "lat", "lon", "lang"];
            values  = ["metric", latitude, longitude, "en"];
        }

        const data      = await ApiManager.fetchData(urlManager.createUrl("weather", keys, values));
        const forecasts = await ApiManager.fetchData(urlManager.createUrl("forecast", keys, values));
        // console.log(forecasts);
        if (data != null) {
            renderSidebar(data);
            renderForecast(forecasts);
        }
    };

    const renderSidebar = (data) => {
        setValue(Element.sidebarLocation, data.name + "," + data.sys.country, null);
        setValue(Element.sidebarTemp, data.main.temp >= 0 ? `+${Math.round(data.main.temp)}` : `-${Math.round(data.main.temp)}` , null);
        setValue(Element.sidebarDate, new Date().toLocaleDateString('en-US', App.dateOptions) , null);
        setValue(Element.sidebarSunrise, new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US',App.timeOptions) , null);
        setValue(Element.sidebarSunset, new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US',App.timeOptions) , null);
        setValue(Element.sidebarWind, `${calculateWindDirection(data.wind.deg)}, ${data.wind.deg}` , null);
        setValue(Element.sidebarHumidity, data.main.humidity + "%" , null);
        setValue(Element.sidebarPressure, data.main.pressure + " hPa" , null);
        renderImageVideos(data.weather[0]);
    }

    const getDivClass = (expr) => {
        let divClass = null;
        if(expr == "Rain"){
            divClass = "rainy";
        }
        else if(expr == "Clear"){
            divClass = "sunny";
        }
        else{
            divClass = "cloudy";
        }
        return divClass;
    }
    
    const renderForecast = (data) => {
        Element.forcastList.innerHTML = "";
        data.list.forEach((day) => {
            let date    = new Date(day.dt_txt.replace(" ", "T"));
            const urls  = filterIcon(day.weather[0]);
            let hours   = date.getHours();
            if (hours === 12) {
                let dayForecast = `<div class="col-md-4 mb-3">
                                        <div class="daily-box ${getDivClass(day.weather[0].main)}">
                                            <p class="type">${day.weather[0].main == "Rain" ? "Rainy" : day.weather[0].main == "Clear" ? "Sunny" : "Cloudy" }</p>
                                            <div class="data-box">
                                                <div class="temp-box">
                                                    <h5 class="temp">
                                                        <span class="value">
                                                            ${day.main.temp >= 0 ? `+${Math.round(day.main.temp)}` : `-${Math.round(day.main.temp)}`}
                                                        </span>
                                                        &#176
                                                    </h5>
                                                </div>
                                                <div class="divider"></div>
                                                <div class="data-info">
                                                    <p class="dt">${new Date(day.dt  * 1000).toLocaleDateString('en-US', App.dateOptions)}</p>
                                                    <p class="location"><i class="fas fa-map-marker-alt"></i>${data.city.name}</p>
                                                </div>
                                                <div class="img-container">
                                                    <img src="${urls[0]}" class="img-fluid w-50" alt="">
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                Element.forcastList.insertAdjacentHTML("beforeend", dayForecast);
            }
        });
    };


    const setValue = (elemetObj, value, type) => {
        if(type == "img"){
            elemetObj.src = value;
        }
        else{
            elemetObj.textContent = value;
        }
    }

    const filterIcon = (weather) => {
        let url_arr = [];
        ApiManager.weatherIcons.forEach((item) => {
            if (item.ids.includes(weather.id)) {
                url_arr.push(item.imgUrl);
                url_arr.push(item.vidUrl);
            }
        });
        return url_arr;
    }

    const renderImageVideos = (weather) => {
        const urls = filterIcon(weather);
        setValue(Element.sidebarWtImg, urls[0], "img");
        Element.vidSrc.setAttribute('src', urls[1]);
        Element.bgVideo.load();
        Element.bgVideo.play();
    }

    const searchAction = async (event) => {
        let value = Element.searchField.value;
        if(event.keyCode === 13 && value == null || value == ""){
            
        }
        else if(event.keyCode === 13){
            await fetchAll(null,null, value);
        }
    }

    const eventListeners = () => {
        Element.searchField.addEventListener("keydown",searchAction);
        Element.btnSearch.addEventListener("click",searchAction);
    }

    function success(pos) {
        var crd = pos.coords;
        fetchAll(crd.latitude, crd.longitude, null);
    }

    // GET CURRENT LOCATION
    const getCurrentLocatin = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success);
        }
    };

    // Calculating Wind Direction
    const calculateWindDirection = (deg) => {
        if (deg > 45 && deg <= 135) {
            return "East";
        } else if (deg > 135 && deg <= 225) {
            return "South";
        } else if (deg > 225 && deg <= 315) {
            return "West";
        } else {
            return "North";
        }
    };

    const renderCountryWidget = (data) => {
        const urls  = filterIcon(data.weather[0]);
        let dayForecast = `<div class="col-md-4 mb-3">
                                    <div class="city-box ${data.weather[0].id == 800 ? "day" : "night"}">
                                        <div class="cityInfo-box d-flex justify-content-between align-items-center">
                                            <p class="type ${data.weather[0].id == 800 ? "black" : "white"}">${data.name.substring(0, 15)}</p>
                                        </div>
                                        <div class="data-box">
                                            <div class="img-container" style="transform: translate(-50%,-100%);">
                                                <img src="${urls[0]}" class="img-fluid ${data.weather[0].id == 800 ? "w-75" : "w-100"}" alt="">
                                            </div>
                                            <div class="temp-box mb-2">
                                                <h5 class="temp ${data.weather[0].id == 800 ? "black" : "white"}">
                                                    <span class="value">
                                                        ${data.main.temp >= 0 ? `+${Math.round(data.main.temp)}` : `-${Math.round(data.main.temp)}`}
                                                    </span>
                                                    &#176
                                                </h5>
                                                <p class="type ${data.weather[0].id == 800 ? "black" : "white"}">${data.weather[0].main}</p>
                                            </div>
                                            <div class="info-widget">
                                                <div class="row info-box">
                                                    <div class="col-md-4 info">
                                                        <h5 class="key ${data.weather[0].id == 800 ? "black" : "white"}">Wind</h5>
                                                        <p class="value ${data.weather[0].id == 800 ? "black" : "white"}" id="sidebar-wd">
                                                            <span class="value ${data.weather[0].id == 800 ? "black" : "white"}">
                                                                ${calculateWindDirection(data.wind.deg)}, ${data.wind.deg}
                                                            </span>
                                                            &#176
                                                        </p>
                                                    </div>
                                                    <div class="col-md-4 info ">
                                                        <h5 class="key ${data.weather[0].id == 800 ? "black" : "white"}">Humidity</h5>
                                                        <p class="value ${data.weather[0].id == 800 ? "black" : "white"}" id="sidebar-hmd">${data.main.humidity}%</p>
                                                    </div>
                                                    <div class="col-md-4 info">
                                                        <h5 class="key ${data.weather[0].id == 800 ? "black" : "white"}">Pressure</h5>
                                                        <p class="value ${data.weather[0].id == 800 ? "black" : "white"}" id="sidebar-pr">${data.main.pressure} hPa</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
        Element.countryList.insertAdjacentHTML("beforeend", dayForecast);
    }

    // EVENT LISTENERS
    const getCountryWeather = async () => {
        const countryList = ["Dubai", "Tokyo", "Australia"];
        if(App.displayCount){
            for (let index = 0; index < countryList.length; index++) {
                await fetchData(countryList[index]);
            }
            App.displayCount = false;
        }
    };

    // RENDER ALL
    const renderAll = () => {
        getCurrentLocatin();

        eventListeners();

        getCountryWeather();
    };

    return {
        renderAll: renderAll(),
    };
}
