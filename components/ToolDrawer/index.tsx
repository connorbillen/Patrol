import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Drawer } from '@material-ui/core'

import { State, actions } from '../../state'

const ToolDrawer = (): JSX.Element => {
    const open: boolean = useSelector((state: State) => state.ToolDrawer.open)  
    const dispatch = useDispatch()
    const toggleDrawer = (): void => {
        dispatch({ type: actions.TOGGLE_TOOLDRAWER })
    }

    return (
        <Drawer anchor={'left'} open={open} onClose={toggleDrawer}>
            Test
        </Drawer>
    )
}

export default ToolDrawer
