import { makeStyles } from '@material-ui/core'
import { Modal, Card, CardContent, Typography, CardActions, Button } from '@material-ui/core'
import dayjs from 'dayjs'
import { Dispatch } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { State, Upload } from '../../interfaces'
import { actions } from '../../state'

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

    const getFile = (): Promise<Blob> => {
        return new Promise(resolve => {
            let input = document.createElement('input');
            input.type = 'file';
    
            input.onchange = _ => {
                let files = Array.from(input.files);
                resolve(files[0]);
            };
    
            input.click();
        });
    }
    
    const conditionalParse = (jsonString: string): any => {
        try {
            return { success: true, ...JSON.parse(jsonString) }
        } catch(e) {
            return { success: false }
        }
    }

    const validateJson = (_json: any): boolean => {
        return true
    }

    const processContent = (content: any): void => {
        if (content.time_enabled || content.title || content.points)
            return
        
        parseFloat(content.points[0].lat)
        parseFloat(content.points[0].lon)
        dayjs(content.points[0].timestamp).unix()
    }

    const uploadFile = async () => {
        const file: Blob = await getFile()
        const reader: FileReader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
            const content: string = readerEvent.target.result as string;
            const parsedContent: any = conditionalParse(content)
            if (parsedContent.success && validateJson(parsedContent)) {
                processContent(content)
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
            <Typography variant="h5" component="h2">
              This is a test
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
