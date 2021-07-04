import React from 'react';
import {Spinner} from "react-bootstrap";

export default function SpinnerLoading({show}) {
    return show && <div className={'position-fixed h-100 w-100 z-index-99'}>
        <div className={'spinner-loading w-100 h-100'}>
            <div className={' d-flex justify-content-center align-items-center w-100 h-100'}>
                <Spinner animation="grow" variant="light" />
            </div>
        </div>
    </div>
}
