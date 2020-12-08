import { createStore, Store } from 'redux'

export interface State {
    ToolDrawer: {
        open: boolean
    }
}

export enum actions {
    'TOGGLE_TOOLDRAWER' = 'TOGGLE_TOOLDRAWER'
}

class StateManager {
    private store: Store
    private initState: State = {
        ToolDrawer: {
            open: false
        }
    }

    constructor () {
        this.store = createStore(this._rootReducer)
    }

    private _rootReducer = (state: State = this.initState, action: {type: string}): Object => {
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