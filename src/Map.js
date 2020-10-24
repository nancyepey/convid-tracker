import React from 'react';
import "./Map.css";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import { showDataOnMap } from "./util";

function Map({ countries, casesType, center, zoom }) {
    return (
        <div className="map">
            {/* we use react-leaflet it needs to be install */}
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm/org/copyright">OpenStreetMap</a> contributors'
                />
                {/* function to loop through all the countries and draw circles on the screen ie on the map */}
                {/* the circles will be bigger if there's more cases, recovered or deaths and smaller if there's are less */}
                {showDataOnMap(countries, casesType)}
            </LeafletMap>
        </div>
    )
}

export default Map
