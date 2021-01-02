import { Modal } from '@material-ui/core'
import { Dispatch } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { State, Upload } from '../../interfaces'
import { actions } from '../../state'

const body = (
    <span>
        Hello!
    </span>
)

const ModalPopup = () => {
    const state: Upload = useSelector((state: State) => state.Upload)
    const dispatcher: Dispatch<any> = useDispatch()

    const toggleModal = (): void => {
        dispatcher({ type: actions.TOGGLE_UPLOAD_MODAL })
    }

    return (
        <Modal
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
