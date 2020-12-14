export interface Layer {
    active: boolean,
    title: string,
    time_enabled: boolean,
    color: string,
    id: number
}

export interface Layers {
    [k: string]: {
        title: string,
        expanded: boolean,
        active: boolean,
        layers: { [k: string]: Layer }
    }
}

export interface State {
    ToolDrawer: {
        open: boolean
    },
    Layers: Layers
}
