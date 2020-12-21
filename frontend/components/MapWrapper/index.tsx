import { DocumentNode, gql, useQuery } from '@apollo/client'
import { LatLngExpression } from 'leaflet'
import React, {} from 'react'
import { MapContainer, TileLayer, Circle } from 'react-leaflet'
import { useSelector } from 'react-redux'

import 'leaflet/dist/leaflet.css'
import { Layer, Map, Point, State, TimeSlider} from '../../interfaces'

const GET_POINTS: DocumentNode = gql`
    query GetPoints($layerIDs: [ID]!, $timestart: Int, $timeend: Int) {
        points(layerIDs: $layerIDs, timestart: $timestart, timeend: $timeend) {
            id
            lat
            lon
            timestamp
        }
    }
`

const MapWrapper = (): JSX.Element => {
    const center: LatLngExpression = [38.0298136917297, -78.4786164046511]
    const layersState: Layer[] = useSelector((state: State) => state.Layers)
    const mapState: Map = useSelector((state: State) => state.Map)
    const enabledLayers = []
    Object.keys(layersState).map((layerGroup: string) => {
        Object.keys(layersState[layerGroup].layers).map((layer: string) => {
            if (layersState[layerGroup].layers[layer].active)
                enabledLayers.push(layer)
        })
    })

    const {data, error} =
        useQuery<any, any>(GET_POINTS, {
            variables: {
                layerIDs: enabledLayers,
                timestart: mapState.timestart,
                timeend: mapState.timeend
            }
        })

    if (error) console.log('err: ', error)

    return (
        <div style={{ height: '100%' }}>
            <MapContainer center={ center } zoom={ 13 } style={{ height: '100%' }}>
                <TileLayer
                    url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
                />
                {(!error && data && data.points && data.points.length) &&
                    data.points.map((point: Point, index: number) => {
                        return (
                            <Circle key={ index } center={ [point.lat, point.lon] } pathOptions={{ fillColor: 'blue' }} radius={ 5 } />
                        )
                    })
                }
            </MapContainer>
        </div>
    )
}

export default MapWrapper
