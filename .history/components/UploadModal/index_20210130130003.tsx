import { useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core";
import {
  Modal,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@material-ui/core";
import { Dispatch } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Point, State, Upload } from "../../interfaces";
import { actions } from "../../state";
import {
  ADD_LAYER,
  ADD_POINT,
  GET_LAYERS,
  GET_POINTS
} from "../../queries";

const ModalPopup = (): JSX.Element => {
  const state: Upload = useSelector((state: State) => state.Upload);
  const dispatcher: Dispatch<any> = useDispatch();
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
  })();

  const [addLayer] = useMutation<any, any>(ADD_LAYER, {
    refetchQueries: [{ query: GET_LAYERS }],
  });

  const [addPoint] = useMutation<any, any>(ADD_POINT, {
    refetchQueries: [{ query: GET_POINTS }],
  });

  const getFile = (): Promise<Blob> => {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";

      input.onchange = (_) => {
        const files = Array.from(input.files);
        resolve(files[0]);
      };

      input.click();
    });
  };

  const validateJson = (_json: any): boolean => {
    return true;
  };

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
    });

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
          }).catch((error) => {
            console.log("", error);
          });
        })
      );
    }
  };

  const uploadFile = async (): Promise<Blob> => {
    const file: Blob = await getFile();
    const reader: FileReader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      const content: string = readerEvent.target.result as string;
      const parsedContent: any = JSON.parse(content);
      if (validateJson(parsedContent)) {
        processContent(parsedContent);
      }
    };
    return file;
  };

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
        <Typography>TODO: Upload instructions go here</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={uploadFile}>
          Upload File
        </Button>
      </CardActions>
    </Card>
  );

  const toggleModal = (): void => {
    dispatcher({ type: actions.TOGGLE_UPLOAD_MODAL });
  };

  return (
    <Modal
      disablePortal={true}
      open={state.modalOpen}
      onClose={() => {
        toggleModal();
      }}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  );
};

export default ModalPopup;
