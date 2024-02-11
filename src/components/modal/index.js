import React, { useEffect, useState } from 'react';
import IconAssets from '../iconAssets';
import './style.css';

const CustomModal = (props) => {
    const { isModalVisible, modalCloseHandler } = props;

    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (isModalVisible) {
            setModalOpen(true);
        }
    }, [isModalVisible]);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);

        modalCloseHandler();
    };

    if (!modalOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <button className="modal-close" onClick={closeModal}><IconAssets.CloseIcon height='20' width='20' filledColor={'#333'} /></button>
                    {props?.children}
                </div>
            </div>
        </div>
    );
};

export default CustomModal;
