// import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import { DocumentNode, gql, useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Dispatch, Fragment } from 'react'
import { useDispatch } from 'react-redux'

import { AppBar, Toolbar, IconButton, Typography, Button, makeStyles } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

import { actions } from '../state'

import ToolDrawer from '../components/ToolDrawer'
import UploadModal from '../components/UploadModal'
const MapWrapper = dynamic(
  () => import('../components/MapWrapper'),
  { ssr: false }
);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const GET_LAYERS: DocumentNode = gql`
    query GetLayers {
        layers {
            id
            title
            time_enabled
        }
    }
`

export default function Home() {
    const classes = useStyles()
    const dispatch: Dispatch<any> = useDispatch()
    const handleMenuClick = (): void => {
        dispatch({ type: actions.TOGGLE_TOOLDRAWER })
    }
    const {data, error} = useQuery<any, any>(GET_LAYERS)

    if (error) return (<div>error!</div>)
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
                        <IconButton onClick={() => { handleMenuClick() }} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Patrol
                    </Typography>
                        <Button color="inherit">Upload Data</Button>
                    </Toolbar>
                </AppBar>

                <ToolDrawer />

                <UploadModal />

                <MapWrapper />
            </div>
        </Fragment>
    )
}
