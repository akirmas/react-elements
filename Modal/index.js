import React from "react";

const Modal = ({ title, text }) => (
    <section className="modal">
        <div className="modal__inner">
            <header className="modal__header">
                <h3 className="modal__title">{title}</h3>
            </header>
            <main className="modal__body">
                <p className="modal__text">{text}</p>
                <div className="modal__loader" />
            </main>
        </div>
    </section>
);

Modal.defaultProps = {
    title: "Message"
};

export default Modal;
