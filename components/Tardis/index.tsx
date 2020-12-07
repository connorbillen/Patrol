import React, {} from 'react'
import Draggable from 'react-draggable'

const Tardis = (): JSX.Element => {

    return (
        <Draggable>
            <div
                style={{
                    position: 'absolute',
                    zIndex: 10000,
                    bottom: 40,
                    left: 40,
                    height: '75px',
                    width: '400px',
                    backgroundColor: '#ccc'
                }}
            >
                Tardis
            </div>
        </Draggable>
    )
}

export default Tardis