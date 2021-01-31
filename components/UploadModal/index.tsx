import { useMutation } from "@apollo/client"
import { makeStyles } from "@material-ui/core"
import {
  Modal,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button
} from "@material-ui/core"
import { Dispatch, useState } from "react"
import { useSelector, useDispatch } from "react-redux"

import { Layers, Point, State, Upload } from "../../interfaces"
import { actions } from "../../state"
import {
  ADD_LAYER,
  ADD_POINT,
  GET_LAYERS,
  GET_POINTS
} from "../../queries"

const ModalPopup = (): JSX.Element => {
  const state: Upload = useSelector((state: State) => state.Upload)
  const layersState: Layers = useSelector((state: State) => state.Layers)
  const dispatcher: Dispatch<any> = useDispatch()
  const [showHistorical, setShowHistorical] = useState(true)
  
  const classes = makeStyles({
    root: {
      width: 400,
      marginTop: 200,
      marginLeft: "auto",
      marginBottom: 0,
      marginRight: "auto",
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    instructions: {
      marginTop: 5,
      marginBottom: 5
    },
    code: {
      background: '#eee',
      height: 150,
      overflowY: 'auto'
    },
    extraSmall: {
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 5,
      paddingRight: 5,
      fontSize: '0.6rem',
      borderRadius: '4px 4px 0px 0px'
    },
    selected: {
      textDecoration: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.06)'
    }
  })()

  const enabledLayers = []
    Object.keys(layersState).map((layerGroup: string) => {
        Object.keys(layersState[layerGroup].layers).map((layer: string) => {
            if (layersState[layerGroup].layers[layer].active)
                enabledLayers.push(layer)
        })
    })

  const [addLayer] = useMutation<any, any>(ADD_LAYER, {
    refetchQueries: [{ query: GET_LAYERS }],
  })

  const [addPoint] = useMutation<any, any>(ADD_POINT, {
    refetchQueries: [{ query: GET_POINTS, variables: { layerIDs: [] } }],
  })

  const getFile = (): Promise<Blob> => {
    return new Promise((resolve) => {
      const input = document.createElement("input")
      input.type = "file"

      input.onchange = (_) => {
        const files = Array.from(input.files)
        resolve(files[0])
      }

      input.click()
    })
  }

  const validateJson = (_json: any): boolean => {
    return true
  }

  const toggleModal = (): void => {
    dispatcher({ type: actions.TOGGLE_UPLOAD_MODAL })
  }

  const processContent = async (content: any): Promise<void> => {
    const layer = await addLayer({
      variables: {
        title: content.title,
        time_enabled: content.time_enabled,
        lat: content.lat,
        lon: content.lon,
        time_start: content.time_start,
        time_end: content.time_end,
      },
    })

    if (!layer.errors) {
      await Promise.all(
        content.points.map((point: Point) => {
          return addPoint({
            variables: {
              lat: parseFloat((point.lat as unknown) as string),
              lon: parseFloat((point.lon as unknown) as string),
              timestamp: point.timestamp,
              layerID: layer.data.addLayer.id,
            },
          }).then(() => {
            toggleModal()
          }).catch((error) => {
            console.log("", error)
          })
        })
      )
    }
  }

  const uploadFile = async (): Promise<Blob> => {
    const file: Blob = await getFile()
    const reader: FileReader = new FileReader()
    reader.readAsText(file, "UTF-8")
    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      const content: string = readerEvent.target.result as string
      const parsedContent: any = JSON.parse(content)
      if (validateJson(parsedContent)) {
        processContent(parsedContent)
      }
    }
    return file
  }

  const body = (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Upload New Data
        </Typography>
        <Typography className={classes.instructions}>
          New layers can be uploaded using a simple JSON file.
        </Typography>
        <Typography className={classes.instructions}>
          Choose which layer type you'd like to upload for an example file format. Working example files are located
          in the Github repository.
        </Typography>
        <div>
          <Button className={ `${ classes.extraSmall } ${ showHistorical ? classes.selected : null }` } onClick={(): void => { setShowHistorical(true) }}>
            Static Data
          </Button>
          <Button className={ `${ classes.extraSmall } ${ !showHistorical ? classes.selected : null }` } onClick={(): void => { setShowHistorical(false) }}>
            Time-based Data
          </Button>
        </div>
        { showHistorical &&  
          <Typography className={classes.code} noWrap> 
              &#123; <br />
              &nbsp;&nbsp;"points": [ <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&#123; "lat": 0.0, "lon": 0.0 &#125;, <br />
              &nbsp;&nbsp;&nbsp;&nbsp;... < br/>
              &nbsp;&nbsp;], <br />
              &nbsp;&nbsp;"time_enabled": 0, <br />
              &nbsp;&nbsp;"title": "Null Island", <br />
              &nbsp;&nbsp;"lat": 0, <br />
              &nbsp;&nbsp;"lon": 0 <br />
              &#125; <br />
          </Typography>
        }
        { !showHistorical &&  
          <Typography className={classes.code} noWrap> 
              &#123; <br />
              &nbsp;&nbsp;"points": [ <br />
              &nbsp;&nbsp;&nbsp;&nbsp;// timestamp is unixtime <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&#123; "lat": 0.0, "lon": 0.0, "timestamp": 123456789 &#125;, <br />
              &nbsp;&nbsp;&nbsp;&nbsp;... < br/>
              &nbsp;&nbsp;], <br />
              &nbsp;&nbsp;"time_enabled": 1, <br />
              &nbsp;&nbsp;"title": "Null Island", <br />
              &nbsp;&nbsp;"lat": 0, <br />
              &nbsp;&nbsp;"lon": 0 <br />
              &#125; <br />
          </Typography>
        }
      </CardContent>
      <CardActions>
        <Button size="small" onClick={ uploadFile }>
          Upload File
        </Button>
      </CardActions>
    </Card>
  )

  return (
    <Modal
      disablePortal={true}
      open={state.modalOpen}
      onClose={() => {
        toggleModal()
      }}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  )
}

export default ModalPopup
