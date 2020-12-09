import { createStore, Store } from 'redux'

import { State } from '../interfaces'

export enum actions {
    'TOGGLE_TOOLDRAWER' = 'TOGGLE_TOOLDRAWER'
}

class StateManager {
    private store: Store
    private initState: State = {
        ToolDrawer: {
            open: false
        },
        Layers: {
            static: {
                label: 'Static',
                expanded: false,
                layers: [
                    {
                        active: false,
                        label: 'Test',
                        color: '#CCCCCC'
                    }
                ]
            },
            historical: {
                label: 'Historical',
                expanded: false,
                layers: [
                    {
                        active: false,
                        label: 'Test',
                        color: '#CCCCCC'
                    }
                ]
            }
        }
    }

    constructor () {
        this.store = createStore(this._rootReducer)
    }

    private _rootReducer = (state: State = this.initState, action: {type: string}): State => {
        switch(action.type) {
            case actions.TOGGLE_TOOLDRAWER:
                return { ...state, ToolDrawer: {open: !state.ToolDrawer.open}}
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