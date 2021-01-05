import { LatLngExpression, Map, ZoomPanOptions } from 'leaflet'
import { useMap } from 'react-leaflet'
import React, { Fragment } from 'react'

const ZoomController = (props: {center: LatLngExpression, zoom: number}): JSX.Element => {
    const map: Map = useMap()
    map.flyTo(props.center, props.zoom, {duration: 1} as ZoomPanOptions)

    return null
}

export default ZoomController