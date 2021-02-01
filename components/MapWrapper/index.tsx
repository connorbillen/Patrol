import { useQuery } from '@apollo/client'
import { LatLngExpression } from 'leaflet'
import { Dispatch } from 'react'
import { MapContainer, TileLayer, Circle } from 'react-leaflet'
import { useSelector, useDispatch } from 'react-redux'

import 'leaflet/dist/leaflet.css'
import { Layers, Map as MapState, Point, State } from '../../interfaces'
import { GET_POINTS } from '../../queries'
import ZoomController from './zoomController'
import { actions } from '../../state'

const MapWrapper = (): JSX.Element => {
    const layersState: Layers = useSelector((state: State) => state.Layers)
    const mapState: MapState = useSelector((state: State) => state.Map)
    const dispatcher: Dispatch<any> = useDispatch()
    const enabledLayers = []
    Object.keys(layersState).map((layerGroup: string) => {
        Object.keys(layersState[layerGroup].layers).map((layer: string) => {
            if (layersState[layerGroup].layers[layer].active)
                enabledLayers.push(layer)
        })
    })
    console.log('', enabledLayers)

    const {data, error} =
        useQuery<any, any>(GET_POINTS, {
            variables: {
                layerIDs: enabledLayers,
                timestart: mapState.timestart,
                timeend: mapState.timeend
            },
            onCompleted: (): void => { dispatcher({ type: actions.TOGGLE_LOADING, data: {loading: false}}) }
        })

    return (
        <div style={{ height: '100%' }}>
            <MapContainer center={ mapState.center as LatLngExpression} zoom={ mapState.zoom } style={{ height: '100%' }}>
                <ZoomController mapCenter={ mapState.center as LatLngExpression } mapZoom={ mapState.zoom } />
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
