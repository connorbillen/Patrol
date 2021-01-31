import { LatLngExpression, Map, ZoomPanOptions } from 'leaflet'
import { useMap } from 'react-leaflet'
import { memo } from 'react'

const ZoomController = memo((props: { mapCenter: LatLngExpression, mapZoom: number }): JSX.Element => {
    const map: Map = useMap()
    map.flyTo(props.mapCenter, props.mapZoom, {duration: 1} as ZoomPanOptions)

    return null
})

export default ZoomController