import L, { LatLngExpression } from 'leaflet'
import React, {} from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
})
L.Marker.prototype.options.icon = DefaultIcon

const MapWrapper = (): JSX.Element => {
    const position: LatLngExpression = [51.505, -0.09]

    return (
        <div style={{ height: '100%' }}>
            <MapContainer center={position} zoom={13} style={{ height: '100%' }}>
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                    <Popup>
                    <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}

export default MapWrapper
