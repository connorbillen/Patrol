import { createStore, Store } from 'redux'

import { Upload, Map, State, TimeSlider } from '../interfaces'

export enum actions {
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
                    Object.keys(newLayers[action.data.layerGroup].layers).some((layer) => {
                        return newLayers[action.data.layerGroup].layers[layer].active
                    })

                if (newLayers[action.data.layerGroup].layers[action.data.id].time_enabled) {
                    newTimeSlider.enabled = true
                    newTimeSlider.timestart = newTimeSlider.timestart ? Math.min(newTimeSlider.timestart, action.data.timestart) : action.data.timestart
                    newTimeSlider.timeend = newTimeSlider.timeend ? Math.max(newTimeSlider.timeend, action.data.timeend) : action.data.timeend
                    if (!newTimeSlider.currentStart && !newTimeSlider.currentEnd) {
                        newTimeSlider.currentStart = newTimeSlider.timestart
                        newTimeSlider.currentEnd = newTimeSlider.timeend
                    }
                } else {
                    // remove layer
                }
                
                return { ...state, Layers: newLayers, TimeSlider: newTimeSlider }
            }
            case actions.TOGGLE_LAYER_CONTAINER: {
                const toggledLayerContainer = { ...state.Layers }
                Object.keys(toggledLayerContainer[action.data.id].layers).map((layer) => {
                    toggledLayerContainer[action.data.id].layers[layer].active = !toggledLayerContainer[action.data.id].active
                })
                toggledLayerContainer[action.data.id].active = !toggledLayerContainer[action.data.id].active
                return { ...state, Layers: toggledLayerContainer }
            }
            case actions.UPDATE_SLIDER_RANGE: {
                const newTimeSlider: TimeSlider = { ...state.TimeSlider }
                newTimeSlider.currentStart = action.data[0]
                newTimeSlider.currentEnd = action.data[1]
                return { ...state, TimeSlider: newTimeSlider }
            }
            case actions.UPDATE_MAP_RANGE: {
                const newMap: Map = { ...state.Map }
                newMap.timestart = state.TimeSlider.currentStart
                newMap.timeend = state.TimeSlider.currentEnd
                return { ...state, Map: newMap }
            }
            case actions.TOGGLE_UPLOAD_MODAL: {
                const newUpload: Upload = { ...state.Upload }
                newUpload.modalOpen = !newUpload.modalOpen

                return { ...state, Upload: newUpload }
            }
            case actions.ZOOM_LAYER: {
                const newMap: Map = { ...state.Map }
                newMap.center = [action.data.lat, action.data.lon]
                newMap.zoom = 13

                return { ...state, Map: newMap }
            }
            default:
                return state
        }
    }

    public getStateInstance = (): Store => {
        return this.store;
    }
}

const stateManager: StateManager = new StateManager()
export default stateManager.getStateInstance()
