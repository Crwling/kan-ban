import React from "react";

import ReactPortal from "../reactPortal";
import Button from "../button";

interface IModalProps {
    handleClose: () => void;
    title: string;
    children?: React.ReactNode;
    closeButtonText?: string;
    isOpen: boolean;
    submitButtonText?: string;
    handleSubmit: () => void;
}

const Modal: React.FC<IModalProps> = ({
    closeButtonText,
    children,
    title,
    isOpen,
    submitButtonText,
    handleClose,
    handleSubmit
}) => {
    if (!isOpen) return null;

    return (
        <ReactPortal wrapperId="react-portal-modal-container">
            <div 
                className="overflow fixed inset-0 z-0" 
                onClick={handleClose}
            />
            <div className="modal flex-col z-10 min-h-80 max-w-10/12 max-h-72 ">
                <div 
                    className="close-button button-24 flex justify-center mt-2 mr-4 ml-auto mb-auto bg-rose-600 w-7 h-7 text-lg" 
                    onClick={handleClose}
                >X</div>
                <div className="mb-auto">{title}</div>
                <div className="mb-auto">
                    {children}
                </div>
                <div className="mb-5 mt-8">
                    {submitButtonText && <Button className="text-base" type="submit" onClick={handleSubmit}>{submitButtonText}</Button>}
                    {closeButtonText && <Button className="text-base" onClick={handleClose}>{closeButtonText}</Button>}
                </div>
            </div>
        </ReactPortal>
    );
}

export default Modal;
