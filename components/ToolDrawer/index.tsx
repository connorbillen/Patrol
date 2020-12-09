import { useState, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ChromePicker } from 'react-color'
import { Drawer, List, ListSubheader, ListItem, ListItemIcon, ListItemText, Collapse, makeStyles } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import { actions } from '../../state'
import { State, Layers } from '../../interfaces'

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
    const drawerOpen: boolean = useSelector((state: State) => state.ToolDrawer.open)
    const layers: Layers = useSelector((state: State) => state.Layers)
    const dispatch = useDispatch()
    const toggleDrawer = (): void => {
        dispatch({ type: actions.TOGGLE_TOOLDRAWER })
    }
    const [open, setOpen] = useState(true);
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <Drawer anchor={ 'left' } open={ drawerOpen } onClose={ toggleDrawer }>
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
                {Object.keys(layers).map((layerGroup, index) => {
                    return ( 
                        <Fragment key={ index }>
                            <ListItem button onClick={handleClick}>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={false}
                                        tabIndex={-1}
                                        inputProps={{ 'aria-labelledby': layers[layerGroup].label }}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={ layers[layerGroup].label } />
                                {open ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {layers[layerGroup].layers.map((layer, index) => {
                                        return (
                                            <ListItem button className={classes.nested} key={ index }>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={false}
                                                        tabIndex={-1}
                                                        inputProps={{ 'aria-labelledby': layers[layerGroup].label }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText primary={ layer.label } />
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
