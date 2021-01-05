import { DocumentNode, gql, useQuery } from '@apollo/client'
import { LatLngExpression, Map } from 'leaflet'
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet'
import { useSelector } from 'react-redux'

import 'leaflet/dist/leaflet.css'
import { Layers, Map as MapState, Point, State } from '../../interfaces'
import ZoomController from './zoomController'

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
    const layersState: Layers = useSelector((state: State) => state.Layers)
    const mapState: MapState = useSelector((state: State) => state.Map)
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

    return (
        <div style={{ height: '100%' }}>
            <MapContainer center={ mapState.center as LatLngExpression} zoom={ mapState.zoom } style={{ height: '100%' }}>
                <ZoomController center={ mapState.center as LatLngExpression } zoom={ mapState.zoom }/>
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
