import { CollectionsOutlined } from '@material-ui/icons'
import { createStore, Store } from 'redux'

import { State } from '../interfaces'

export enum actions {
    'TOGGLE_TOOLDRAWER' = 'TOGGLE_TOOLDRAWER',
    'ADD_LAYER' = 'ADD_LAYER',
    'EXPAND_LAYER_CONTAINER' = 'EXPAND_LAYER_CONTAINER',
    'TOGGLE_LAYER' = 'TOGGLE_LAYER',
    'TOGGLE_LAYER_CONTAINER' = 'TOGGLE_LAYER_CONTAINER'
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
        }
    }

    constructor () {
        this.store = createStore(this._rootReducer)
    }

    private _rootReducer = (state: State = this.initState, action: {type: string, data?: any}): State => {
        switch(action.type) {
            case actions.TOGGLE_TOOLDRAWER:
                return { ...state, ToolDrawer: {open: !state.ToolDrawer.open}}
            case actions.ADD_LAYER:
                if (action.data.time_enabled && !state.Layers.historical.layers[action.data.id]) {
                    const newLayers = { ...state.Layers }
                    newLayers.historical.layers[action.data.id] = { ...action.data, active: false }
                    return { ...state, Layers: newLayers }
                } else if (!action.data.time_enabled && !state.Layers.static.layers[action.data.id]) {
                    const newLayers = { ...state.Layers }
                    newLayers.static.layers[action.data.id] = { ...action.data, active: false }
                    return { ...state, Layers: newLayers }
                }

                return state
            case actions.EXPAND_LAYER_CONTAINER:
                const expandedLayerContainer = { ...state.Layers }
                expandedLayerContainer[action.data.id].expanded = !state.Layers[action.data.id].expanded
                return { ...state, Layers: expandedLayerContainer }
            case actions.TOGGLE_LAYER:
                const toggledLayer = { ...state.Layers }
                toggledLayer[action.data.layerGroup].layers[action.data.layerID].active =
                    !toggledLayer[action.data.layerGroup].layers[action.data.layerID].active
                toggledLayer[action.data.layerGroup].active =
                    Object.keys(toggledLayer[action.data.layerGroup].layers).some((layer) => {
                        return toggledLayer[action.data.layerGroup].layers[layer].active
                    })
                return { ...state, Layers: toggledLayer }
            case actions.TOGGLE_LAYER_CONTAINER:
                const toggledLayerContainer = { ...state.Layers }
                Object.keys(toggledLayerContainer[action.data.id].layers).map((layer) => {
                    toggledLayerContainer[action.data.id].layers[layer].active = !toggledLayerContainer[action.data.id].active
                })
                toggledLayerContainer[action.data.id].active = !toggledLayerContainer[action.data.id].active
                return { ...state, Layers: toggledLayerContainer }
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
