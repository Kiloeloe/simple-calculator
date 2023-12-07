import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import "./Modal.css";
import Ticket from "./Ticket";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  topic: string;
  description: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function Modal({ isOpen, onClose }: ModalProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    topic: "",
    description: "",
  });

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<number | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", clickOutside);
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.firstName && formData.lastName && formData.email) {
      console.log("form submitted", formData);
      setIsFormSubmitted(true);
      setTicketNumber(Math.floor(1000 + Math.random() * 9000));
    }
  };

  const handleClose = () => {
    setTimeout(() => {
      onClose();
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        topic: "",
        description: "",
      });
      setIsFormSubmitted(false);
      setTicketNumber(null);
    }, 15000);
  };

  const isSubmitDisabled =
    !formData.firstName ||
    !formData.lastName ||
    !formData.email ||
    !formData.topic;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal" ref={modalRef}>
          <div>
            <h1>Support Ticket Form</h1>
            <hr className="solid" />
          </div>
          <form className="form-container" onSubmit={handleSubmit}>
            <div className="inner-form">
              <div className="left-container">
                <div className="outer-input">
                  <h3>Name <span>*</span></h3>
                  <div className="name-container">
                    <div className="input-container">
                      <input
                        type="name"
                        name="firstName"
                        className="name-input"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                      <label>First</label>
                    </div>
                    <div className="input-container">
                      <input
                        type="name"
                        name="lastName"
                        className="name-input"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                      <label>Last</label>
                    </div>
                  </div>
                </div>
                <div className="input-container">
                  <label>Email <span>*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="outer-input">
                  <h3>Topic <span>*</span></h3>
                  <div className="radio-container">
                    What can we help you today?:
                    <div className="radio-input">
                      <input
                        type="radio"
                        name="topic"
                        value="General"
                        checked={formData.topic === "General"}
                        onChange={handleChange}
                        required
                      />
                      <label>General</label>
                    </div>
                    <div className="radio-input">
                      <input
                        type="radio"
                        name="topic"
                        value="Bug"
                        checked={formData.topic === "Bug"}
                        onChange={handleChange}
                        required
                      />
                      <label>Bug</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="right-container">
                <h3>Description <span className="desc-opt">optional</span></h3>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description Report"
                ></textarea>
              </div>
            </div>
            <div className="bottom-container">
              <button
                type="submit"
                className="send-button"
                disabled={isSubmitDisabled}
                onClick={handleClose}
              >
                SEND
              </button>
            </div>
          </form>
        </div>
      </div>
      {isFormSubmitted && (
        <Ticket
          isOpen={isFormSubmitted}
          onClose={handleClose}
          ticketNumber={ticketNumber!}
        />
      )}
    </>
  );
}

export default Modal;
