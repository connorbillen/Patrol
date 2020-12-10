// import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Fragment } from 'react'
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

export default function Home() {
  const classes = useStyles()
  const dispatch = useDispatch()

  const handleMenuClick = (): void => {
    debugger
    dispatch({ type: actions.TOGGLE_TOOLDRAWER })
  }

  return (
    <Fragment>
      <Head>
          <title>Patrol</title>
        </Head>
      <div style={{ height: '100%' }}>
          <AppBar position="absolute">
            <Toolbar>
              <IconButton onClick={ () => { handleMenuClick() } } edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
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