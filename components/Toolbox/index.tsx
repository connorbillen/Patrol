import React, {} from 'react'
import Draggable from 'react-draggable'

import styles from '../../styles/Toolbox.module.css'

const Toolbox = (): JSX.Element => {

    return (
        <Draggable>
            <div
                className={styles.container}
            >
                Toolbox
            </div>
        </Draggable>
    )
}

export default Toolbox