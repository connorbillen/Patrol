import { Fragment, MouseEvent as ReactMouseEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ChromePicker } from 'react-color'
import { Drawer, List, ListSubheader, ListItem, ListItemIcon, ListItemText, Collapse, makeStyles } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import { actions } from '../../state'
import { State } from '../../interfaces'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        minWidth: 300,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

const ToolDrawer = (): JSX.Element => {
    const classes = useStyles();
    const state: State = useSelector((state: State) => state)
    const dispatch = useDispatch()

    const toggleDrawer = (): void => {
        dispatch({ type: actions.TOGGLE_TOOLDRAWER, data: null })
    }

    const expandLayerGroup = (layerGroup: string) => {
        dispatch({ type: actions.EXPAND_LAYER_CONTAINER, data: {id: layerGroup} })
    }

    const toggleLayer = (layerGroup: string, layerID: number) => {
        dispatch({ type: actions.TOGGLE_LAYER, data: {layerGroup, layerID} })
    }

    const toggleLayerContainer = (layerGroup: string) => {
        dispatch({ type: actions.TOGGLE_LAYER_CONTAINER, data: {id: layerGroup} })
    }

    return (
        <Drawer anchor={ 'left' } open={ state.ToolDrawer.open } onClose={ toggleDrawer }>
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Layers
                    </ListSubheader>
                }
                className={classes.root}
            >
                { Object.keys(state.Layers).map((layerGroup, index) => {
                    return ( 
                        <Fragment key={ index }>
                            <ListItem button onClick={ () => { expandLayerGroup(layerGroup) }}>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={ state.Layers[layerGroup].active }
                                        tabIndex={ -1 }
                                        inputProps={{ 'aria-labelledby': state.Layers[layerGroup].title }}
                                        onClick={ (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => { 
                                            event.stopPropagation()
                                            toggleLayerContainer(layerGroup)
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={ state.Layers[layerGroup].title } />
                                { state.Layers[layerGroup].expanded ? <ExpandLess /> : <ExpandMore /> }
                            </ListItem>
                            <Collapse in={ state.Layers[layerGroup].expanded } timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    { Object.keys(state.Layers[layerGroup].layers).map((layer, index) => {
                                        return (
                                            <ListItem button className={classes.nested} key={ index }>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={ state.Layers[layerGroup].layers[layer].active } 
                                                        tabIndex={ -1 }
                                                        inputProps={{ 'aria-labelledby': state.Layers[layerGroup].title }}
                                                        onClick={ () => { toggleLayer(layerGroup, state.Layers[layerGroup].layers[layer].id) }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText primary={ state.Layers[layerGroup].layers[layer].title } />
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </Collapse>
                        </Fragment>
                    )})}
            </List>
        </Drawer>
    )
}

export default ToolDrawer
