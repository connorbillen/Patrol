import React, {} from 'react'
import Draggable from 'react-draggable'

const Toolbox = (): JSX.Element => {

    return (
        <Draggable>
            <div
                style={{
                    position: 'absolute',
                    zIndex: 10000,
                    top: 150,
                    left: 40,
                    height: '200px',
                    width: '75px',
                    backgroundColor: '#ccc'
                }}
            >
                Toolbox
            </div>
        </Draggable>
    )
}

export default Toolbox