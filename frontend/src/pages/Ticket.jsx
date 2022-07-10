import { useSelector, useDispatch } from "react-redux";
import { getTicket, closeTicket } from "../features/tickets/ticketSlice";
import { getNotes, createNote } from "../features/notes/noteSlice";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import NoteItem from "../components/NoteItem";
import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
Modal.setAppElement("#root");

const Ticket = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const { ticket, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  );

  const { notes, isLoading: notesIsLoading } = useSelector(
    (state) => state.notes
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { ticketId } = params;

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getTicket(ticketId));
    dispatch(getNotes(ticketId));
    // eslint-disable-next-line
  }, [isError, message, ticketId]);

  // Close the ticket
  const onTicketClose = () => {
    dispatch(closeTicket(ticketId));
    toast.success("Ticket Closed");
    navigate("/tickets");
  };

  // Create note submit
  const onNoteSubmit = (e) => {
    e.preventDefault();
    console.log("create note");
    dispatch(createNote({ ticketId, noteText }));
    closeModal();
  };
  // Open and close Modal
  const openModal = () => {
    setModalIsOpen(true);
  };
  // const afterOpenModal = () => {
  //   subtitle.style.color = "#f00";
  // };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (isLoading || notesIsLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h3>Something Went Wrong</h3>;
  }

  return (
    <>
      <div className="ticket-page">
        <header className="ticket-header">
          <BackButton url="/tickets" />
          <h2>
            Ticket ID: {ticket._id}
            <span className={`status status-${ticket.status}`}>
              {ticket.status}
            </span>
          </h2>
          <h3>
            Date Submitted: {new Date(ticket.createdAt).toLocaleString("en-US")}
          </h3>
          <h3>Product: {ticket.product}</h3>
          <hr />
          <div className="ticket-desc">
            <h3>Description of Issues</h3>
            <p>{ticket.description}</p>
          </div>
          <h3>Notes</h3>
        </header>

        {ticket.status !== "closed" && (
          <button className="btn" onClick={openModal}>
            <FaPlus /> Add Note
          </button>
        )}

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Add Note"
        >
          <h2>Add Note</h2>
          <button onClick={closeModal} className="btn-close">
            X
          </button>
          <form onSubmit={onNoteSubmit}>
            <div className="form-group">
              <textarea
                name="noteText"
                id="noteText"
                className="form-controll"
                placeholder="Note text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              ></textarea>
              <div className="form-group">
                <button className="btn" type="submit">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </Modal>

        {notes.map((note) => (
          <NoteItem note={note} key={note._id} />
        ))}

        {ticket.status !== "closed" && (
          <button className="btn btn-block btn-danger" onClick={onTicketClose}>
            Close Ticket
          </button>
        )}
      </div>
    </>
  );
};
export default Ticket;
