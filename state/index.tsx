import { TurnedIn } from '@material-ui/icons'
import { LatLngExpression } from 'leaflet'
import { createStore, Store } from 'redux'

import { Upload, Map, State, TimeSlider, Layers, Layer } from '../interfaces'

export enum actions {
    'TOGGLE_LOADING' = 'TOGGLE_LOADING',
    'TOGGLE_TOOLDRAWER' = 'TOGGLE_TOOLDRAWER',
    'ADD_LAYER' = 'ADD_LAYER',
    'EXPAND_LAYER_CONTAINER' = 'EXPAND_LAYER_CONTAINER',
    'TOGGLE_LAYER' = 'TOGGLE_LAYER',
    'TOGGLE_LAYER_CONTAINER' = 'TOGGLE_LAYER_CONTAINER',
    'UPDATE_SLIDER_RANGE' = 'UPDATE_SLIDER_RANGE',
    'UPDATE_MAP_RANGE' = 'UPDATE_MAP_RANGE',
    'TOGGLE_UPLOAD_MODAL' = 'TOGGLE_UPLOAD_MODAL',
    'ZOOM_LAYER' = 'ZOOM_LAYER'
}

class StateManager {
    private store: Store
    private initState: State = {
        App: {
            loading: false
        },
        ToolDrawer: {
            open: false
        },
        Layers: {
            static: {
                title: 'Static',
                expanded: false,
                active: false,
                layers: {}
            },
            historical: {
                title: 'Historical',
                expanded: false,
                active: false,
                layers: {}
            }
        },
        Map: {
            timestart: null,
            timeend: null,
            center: [0, 0],
            zoom: 3
        },
        TimeSlider: {
            enabled: false,
            timestart: null,
            timeend: null,
            currentStart: null,
            currentEnd: null
        },
        Upload: {
            modalOpen: false
        }
    }

    constructor () {
        this.store = createStore(this._rootReducer)
    }

    private _rootReducer = (state: State = this.initState, action: {type: string, data?: any}): State => {
        switch(action.type) {
            case actions.TOGGLE_LOADING: {
                return { ...state, App: {loading: action.data ? action.data.loading : !state.App.loading}}
            }
            case actions.TOGGLE_TOOLDRAWER: {
                return { ...state, ToolDrawer: {open: !state.ToolDrawer.open}}
            }
            case actions.ADD_LAYER: {
                if (action.data.time_enabled === 1 && !state.Layers.historical.layers[action.data.id]) {
                    const newLayers = { ...state.Layers }
                    newLayers.historical.layers[action.data.id] = { ...action.data, active: false }
                    return { ...state, Layers: newLayers }
                } else if (action.data.time_enabled === 0 && !state.Layers.static.layers[action.data.id]) {
                    const newLayers = { ...state.Layers }
                    newLayers.static.layers[action.data.id] = { ...action.data, active: false }
                    return { ...state, Layers: newLayers }
                }

                return state
            }
            case actions.EXPAND_LAYER_CONTAINER: {
                const expandedLayerContainer = { ...state.Layers }
                expandedLayerContainer[action.data.id].expanded = !state.Layers[action.data.id].expanded
                return { ...state, Layers: expandedLayerContainer }
            }
            case actions.TOGGLE_LAYER: {
                const newTimeSlider: TimeSlider = { ...state.TimeSlider }
                const newLayers = { ...state.Layers }

                newLayers[action.data.layerGroup].layers[action.data.id].active =
                    !newLayers[action.data.layerGroup].layers[action.data.id].active
                newLayers[action.data.layerGroup].active =
                    Object.keys(newLayers[action.data.layerGroup].layers).some((layer: string) => {
                        return newLayers[action.data.layerGroup].layers[layer].active
                    })

                newTimeSlider.enabled = this._timeLayerEnabled(newLayers)
                if (!newTimeSlider.enabled) {
                    newTimeSlider.timestart = null
                    newTimeSlider.timeend = null
                    newTimeSlider.currentStart = null
                    newTimeSlider.currentEnd = null
                } else {
                    const newTimeRange = this._calculateNewTimeRange(newLayers, newTimeSlider)
                    newTimeSlider.timestart = newTimeRange[0][0]
                    newTimeSlider.timeend = newTimeRange[0][1]
                    newTimeSlider.currentStart = newTimeRange[1][0]
                    newTimeSlider.currentEnd = newTimeRange[1][1]
                }

                return { ...state, Layers: newLayers, TimeSlider: newTimeSlider }
            }
            case actions.TOGGLE_LAYER_CONTAINER: {
                const toggledLayerContainer: Layers = { ...state.Layers }
                const newTimeSlider: TimeSlider = { ...state.TimeSlider }
                
                Object.keys(toggledLayerContainer[action.data.id].layers).map((layer) => {
                    toggledLayerContainer[action.data.id].layers[layer].active = !toggledLayerContainer[action.data.id].active
                })
                toggledLayerContainer[action.data.id].active = !toggledLayerContainer[action.data.id].active
                newTimeSlider.enabled = this._timeLayerEnabled(toggledLayerContainer)
                if (!newTimeSlider.enabled) {
                    newTimeSlider.timestart = null
                    newTimeSlider.timeend = null
                    newTimeSlider.currentStart = null
                    newTimeSlider.currentEnd = null
                } else {
                    const [newTimeRange, newCurrentTimeRange] = this._calculateNewTimeRange(toggledLayerContainer, newTimeSlider)
                    newTimeSlider.timestart = newTimeRange[0]
                    newTimeSlider.timeend = newTimeRange[1]
                    newTimeSlider.currentStart = newCurrentTimeRange[0]
                    newTimeSlider.currentEnd = newCurrentTimeRange[1]
                }
                return { ...state, Layers: toggledLayerContainer, TimeSlider: newTimeSlider }
            }
            case actions.UPDATE_SLIDER_RANGE: {
                const newTimeSlider: TimeSlider = { ...state.TimeSlider }
                newTimeSlider.currentStart = action.data[0]
                newTimeSlider.currentEnd = action.data[1]
                return { ...state, TimeSlider: newTimeSlider }
            }
            case actions.UPDATE_MAP_RANGE: {
                const newMap: Map = { ...state.Map }
                newMap.timestart = state.TimeSlider.currentStart ? state.TimeSlider.currentStart : state.TimeSlider.timestart
                newMap.timeend = state.TimeSlider.currentEnd ? state.TimeSlider.currentEnd : state.TimeSlider.timeend
                return { ...state, Map: newMap }
            }
            case actions.TOGGLE_UPLOAD_MODAL: {
                const newUpload: Upload = { ...state.Upload }
                newUpload.modalOpen = !newUpload.modalOpen

                return { ...state, Upload: newUpload }
            }
            case actions.ZOOM_LAYER: {
                const newMap: Map = { ...state.Map }
                newMap.center = [action.data.lat, action.data.lon] as LatLngExpression
                newMap.zoom = 13

                return { ...state, Map: newMap }
            }
            default:
                return state
        }
    }

    private _timeLayerEnabled = (layers: Layers): boolean => {
        return Object.keys(layers).some((layerContainerId: string): boolean => {
            return Object.keys(layers[layerContainerId].layers).some((layerId: string): boolean => {
                const layer: Layer = layers[layerContainerId].layers[layerId]
                return layer.time_enabled && layer.active ? true : false
            })
        })
    }

    private _calculateNewTimeRange = (layers: Layers, timeSlider: TimeSlider): [[number, number], [number, number]] => {
        const startTimes: Array<number> = []
        const endTimes: Array<number> = []
        Object.keys(layers).map((layerContainerId: string) => {
            return Object.keys(layers[layerContainerId].layers).map((layerId: string) => {
                const layer: Layer = layers[layerContainerId].layers[layerId]
                if (layer.time_enabled && layer.active) {
                    startTimes.push(layer.timestart)
                    endTimes.push(layer.timeend)
                }
            })
        })

        const minTime: number = Math.min(...startTimes)
        const maxTime: number = Math.max(...endTimes)

        const currentStart: number = timeSlider.currentStart ? 
            Math.max(timeSlider.currentStart, timeSlider.timestart) : 
            minTime
        const currentEnd: number = timeSlider.currentEnd ?
            Math.min(timeSlider.currentEnd, timeSlider.timeend) :
            maxTime

        return [[currentStart, currentEnd], [minTime, maxTime]]
    }

    public getStateInstance = (): Store => {
        return this.store
    }
}

const stateManager: StateManager = new StateManager()
export default stateManager.getStateInstance()
