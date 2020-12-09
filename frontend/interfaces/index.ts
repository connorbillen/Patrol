export interface Layer {
    active: boolean,
    label: string,
    color: string
}

export interface Layers {
    [k: string]: {
        label: string,
        expanded: boolean,
        layers: Array<Layer>
    }
}

export interface State {
    ToolDrawer: {
        open: boolean
    },
    Layers: Layers
}
