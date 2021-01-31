import { makeStyles, CircularProgress } from "@material-ui/core"
import { useSelector } from "react-redux"
import { State } from "../../interfaces"

const useStyles = makeStyles((theme) => ({
    overlay: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1101, // Overlay needs to be above the map and app bar
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}))

const LoadingOverlay = (): JSX.Element => {
  const state: { loading: boolean } = useSelector((state: State) => state.App)
  const classes = useStyles()

  return (
    state.loading &&
    <div className={ classes.overlay }>
        <CircularProgress />
    </div>
  )
}

export default LoadingOverlay
