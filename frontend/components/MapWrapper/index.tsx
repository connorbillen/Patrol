import { DocumentNode, gql, useQuery } from '@apollo/client'
import L, { LatLngExpression } from 'leaflet'
import React, {} from 'react'
import { MapContainer, TileLayer, Circle } from 'react-leaflet'
import { useSelector, useDispatch } from 'react-redux'

import 'leaflet/dist/leaflet.css'
// import icon from 'leaflet/dist/images/marker-icon.png'
// import iconShadow from 'leaflet/dist/images/marker-shadow.png'

import { Point, State} from '../../interfaces'

const GET_POINTS: DocumentNode = gql`
    query GetPoints($layerIDs: [ID]!) {
        points(layerIDs: $layerIDs) {
            id
            lat
            lon
        }
    }
`
/*
const DefaultIcon: L.Icon<L.IconOptions> = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12.5, 20.5]
})
L.Marker.prototype.options.icon = DefaultIcon
*/

const MapWrapper = (): JSX.Element => {
    const position: LatLngExpression = [51.505, -0.09]
    const state: State = useSelector((state: State) => state)
    const enabledLayers = []
    Object.keys(state.Layers).map((layerGroup: string) => {
        Object.keys(state.Layers[layerGroup].layers).map((layer: string) => {
            if (state.Layers[layerGroup].layers[layer].active)
                enabledLayers.push(layer)
        })
    })

    const {data, error} =
        useQuery<any, any>(GET_POINTS, {
            variables: {
                layerIDs: enabledLayers
            }
        })

    return (
        <div style={{ height: '100%' }}>
            <MapContainer center={ position } zoom={ 13 } style={{ height: '100%' }}>
                <TileLayer
                    url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
                />
                {(!error && data && data.points && data.points.length) ?
                    data.points.map((point: Point, index: number) => {
                        return (
                            <Circle key={ index } center={ [point.lon, point.lat] } pathOptions={{ fillColor: 'blue' }} radius={ 10 } />
                        )
                    }) :
                    <div></div>
                }
            </MapContainer>
        </div>
    )
}

export default MapWrapper
