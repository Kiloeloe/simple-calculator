import React, { useEffect, useRef, useState } from "react";
import "./Modal.css";

interface TicketProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumber: number | null;
}

const Ticket: React.FC<TicketProps> = ({ isOpen, onClose, ticketNumber }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [closePopup, setClosePopup] = useState(false);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setClosePopup(true);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", clickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (closePopup) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" ref={modalRef} tabIndex={-1}>
      <div className="modal">
        <div>
          <h1>Support Ticket Form</h1>
          <hr className="solid" />
        </div>
        <div className="ticket-message">
          <h2>
            Thank you for sending us your report, we will <br /> 
            track the problem now
          </h2>
          <p>
            ticket number: <span>{ticketNumber}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
