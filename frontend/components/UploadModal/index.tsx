import { Modal } from '@material-ui/core'

const body = (
    <span>
        Hello!
    </span>
)

const ModalPopup = () => {
    return (
        <Modal
            open={false}
            onClose={() => {}}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {body}
        </Modal>
    )
}

export default ModalPopup
