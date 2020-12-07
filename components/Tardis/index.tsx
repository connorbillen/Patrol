import React, {} from 'react'
import Draggable from 'react-draggable'

import styles from '../../styles/Tardis.module.css'

const Tardis = (): JSX.Element => {

    return (
        <Draggable>
            <div
                className={styles.container}
            >
                Tardis
            </div>
        </Draggable>
    )
}

export default Tardis