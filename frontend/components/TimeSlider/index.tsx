import { Slider, createMuiTheme, ThemeProvider, Typography, withStyles } from '@material-ui/core'
import { unix as UnixToDate } from 'dayjs'
import { useSelector, useDispatch } from 'react-redux'
import { useDebounce } from 'use-debounce'

import { actions } from '../../state'
import { State, TimeSlider as TimeSliderState} from '../../interfaces'
import { useState } from 'react'

const muiTheme = createMuiTheme({
    overrides: {
        MuiSlider: {
            colorPrimary: {
                color: '#fff'
            },
            colorSecondary: {
                color: '#fff'
            }
        },
        MuiTypography: {
            body1: {
                fontSize: '0.7rem'
            }
        }
    }
})

const TimeStartLabel = withStyles({
    root: {
        marginLeft: '50px',
        marginRight: '20px',
        wordBreak: 'keep-all'
    }
})(Typography)

const TimeEndLabel = withStyles({
    root: {
        marginRight: '50px',
        marginLeft: '20px',
        wordBreak: 'keep-all'
    }
})(Typography)

const TimeSlider = (): JSX.Element => {
    const state: TimeSliderState = useSelector((state: State) => state.TimeSlider)
    const dispatch = useDispatch()
    const [mapUpdater, setMapUpdater] = useState(setTimeout(() => {}, 0))

    const newSliderValue = (_event, range): void => {
        dispatch({ type: actions.UPDATE_SLIDER_RANGE, data: range })
        clearTimeout(mapUpdater)
        setMapUpdater(setTimeout(() => { dispatch({ type: actions.UPDATE_MAP_RANGE })}, 1000))
    }

    return (
        <ThemeProvider theme={ muiTheme }>
            <TimeStartLabel>
                { state.enabled && state.currentStart ? UnixToDate(state.currentStart).toDate().toISOString().split('T').join(' ') : ' - ' }
            </TimeStartLabel>
            <Slider
                value={ [state.currentStart, state.currentEnd] }
                onChange={ newSliderValue }
                valueLabelDisplay="off"
                min={ state.timestart }
                max={ state.timeend }
                disabled={ !state.enabled }
            />
            <TimeEndLabel>
                { state.enabled && state.currentEnd ? UnixToDate(state.currentEnd).toDate().toISOString().split('T').join(' ')  : ' - ' }
            </TimeEndLabel>
        </ThemeProvider>
    )
}

export default TimeSlider
