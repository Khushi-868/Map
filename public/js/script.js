const socket =io();

console.log("hhello")
if(navigator.geolocation)
{
    navigator.geolocation.watchPosition((position)=>{
        const {lati,longi } = position.coords;
        socket.emit("send-location ",{lati,longi});

    },(error)=>{
        console.log("error");
    },{
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0
    }
)
}

const map=L.map('map').setView([0,0],10)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    
    attribution: 'Institute of Engineering and Rural Technology',
}).addTo(map);
var markers = L.marker([51.5, -0.09]).addTo(map);

socket.on("receive-locaton",(data)=>{
    const{id,latitude,longitude}=data;
    map.setView([latitude,longitude],16);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id]=L.makers([latitude,longitude]).addTo(map);
    }
});

socket.on("user-disconnect",(id)=>{
    if(markers[id]){
        map.removeLayer(makers[id]);
        delete markers[id];
    }
})