import { useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Dispatch, Fragment } from 'react'
import { useDispatch } from 'react-redux'

import { AppBar, Toolbar, IconButton, Typography, Button, makeStyles } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

import { actions } from '../state'
import { GET_LAYERS } from '../queries'

import ToolDrawer from '../components/ToolDrawer'
import TimeSlider from '../components/TimeSlider'
import UploadModal from '../components/UploadModal'
import LoadingOverlay from '../components/LoadingOverlay'
const MapWrapper = dynamic(
  () => import('../components/MapWrapper'),
  { ssr: false }
)

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  }
}))

export default function Home() {
    const classes = useStyles()
    const dispatch: Dispatch<any> = useDispatch()

    const handleMenuClick = (): void => {
        dispatch({ type: actions.TOGGLE_TOOLDRAWER })
    }

    const handleUploadClick = (): void => {
        dispatch({ type: actions.TOGGLE_UPLOAD_MODAL })
    }

    const {data, error, loading} = useQuery<any, any>(GET_LAYERS, {
        onCompleted: (): void => { dispatch({ type: actions.TOGGLE_LOADING, data: {loading: false}})} 
    })

    if (error && !loading) return (<div>Error communicating with backend</div>)
    if (data) {
        data.layers.map((layer) => {
            dispatch({ type: actions.ADD_LAYER, data: layer })
        })
    }

    return (
        <Fragment>
            <Head>
                <title>Patrol</title>
            </Head>
            <div style={{ height: '100%' }}>
                <AppBar position="absolute">
                    <Toolbar>
                        <IconButton onClick={ handleMenuClick } edge="start" className={ classes.menuButton } color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6">
                            Patrol
                        </Typography>
                        <TimeSlider />
                        <Button onClick={ handleUploadClick } color="inherit">Upload</Button>
                    </Toolbar>
                </AppBar>
                
                <LoadingOverlay />

                <ToolDrawer />

                <UploadModal />

                <MapWrapper />
            </div>
        </Fragment>
    )
}
