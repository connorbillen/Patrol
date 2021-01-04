import { DocumentNode, gql, useMutation } from '@apollo/client'
import { makeStyles } from '@material-ui/core'
import { Modal, Card, CardContent, Typography, CardActions, Button } from '@material-ui/core'
import dayjs from 'dayjs'
import { Dispatch } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Point, State, Upload } from '../../interfaces'
import { actions } from '../../state'


const ADD_POINT: DocumentNode = gql`
  mutation AddPoint($layerID: ID!, $lat: Float!, $lon: Float!, $timestamp: Int!) {
    addPoint(layerID: $layerID, lat: $lat, lon: $lon, timestamp: $timestamp) {
      success
    }
  }
`;

const ADD_LAYER: DocumentNode = gql`
  mutation AddLayer($title: String!, $time_enabled: Int!, $time_start: Int, $time_end: Int) {
    addLayer(title: $title, time_enabled: $time_enabled, time_start: $time_start, time_end: $time_end) {
      success
      id
    }
  }
`;

const ModalPopup = () => {
    const state: Upload = useSelector((state: State) => state.Upload)
    const dispatcher: Dispatch<any> = useDispatch()
    const classes = makeStyles({
        root: {
          width: 400,
          marginTop: 200,
          marginLeft: "auto",
          marginBottom: 0,
          marginRight: "auto"
        },
        bullet: {
          display: 'inline-block',
          margin: '0 2px',
          transform: 'scale(0.8)',
        },
        title: {
          fontSize: 14,
        },
        pos: {
          marginBottom: 12,
        },
    })();

    const [addLayer] = useMutation<
        any,
        any
        >(
        ADD_LAYER,
        {
            onCompleted({ addLayer }) {
                if (addLayer) {
                    console.log(addLayer.success)
                    console.log(addLayer.id)
                }
            }
        }
    );

    const [addPoint] = useMutation<any, any>(
        ADD_POINT,
        {
            onCompleted({ addPoint }) {
                if (addPoint) {
                    console.log(addPoint.success)
                }
            }
        }
    );

    const getFile = (): Promise<Blob> => {
        return new Promise(resolve => {
            const input = document.createElement('input')
            input.type = 'file'
    
            input.onchange = _ => {
                const files = Array.from(input.files)
                resolve(files[0])
            }
    
            input.click()
        });
    }

    const validateJson = (_json: any): boolean => {
        return true
    }

    const processContent = async (content: any): Promise<void> => {     
        const layer = await addLayer({
            variables: {
                title: content.title,
                time_enabled: content.time_enabled,
                time_start: content.time_start,
                time_end: content.time_end
            }
        })
        console.log('', layer)

        if (!layer.errors) {
            content.points.forEach(async (point: Point) => {
                console.log('', layer)
                const newPoint = await addPoint({
                    variables: {
                        lat: parseFloat(point.lat as unknown as string),
                        lon: parseFloat(point.lon as unknown as string), 
                        timestamp: point.timestamp,
                        layerID: layer.data.addLayer.id
                    }
                }).catch((error) => {
                    console.log('', error)
                })
                console.log('', newPoint)
            })
        }
    }

    const uploadFile = async (): Promise<Blob> => {
        const file: Blob = await getFile()
        const reader: FileReader = new FileReader()
        reader.readAsText(file, 'UTF-8')
        reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
            const content: string = readerEvent.target.result as string;
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
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Upload New Data
            </Typography>
            <Typography>
              TODO: Upload instructions go here
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={ uploadFile }>Upload File</Button>
          </CardActions>
        </Card>
    )

    const toggleModal = (): void => {
        dispatcher({ type: actions.TOGGLE_UPLOAD_MODAL })
    }

    return (
        <Modal
            disablePortal={ true }
            open={ state.modalOpen }
            onClose={() => { toggleModal() }}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {body}
        </Modal>
    )
}

export default ModalPopup
