import React from "react";
import Add from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom"

function CreateArea(props) {

  const [isExpanded, setExpanded] = React.useState(false);



  // Create a constant that keeps track of the title and content of a note that is typed in

  const [note, setNote] = React.useState({
    title: "",
    content: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  // Passing the note back to the App and resetting the new note section
  function submitNote(event) {
    props.onAdd(note);
    setNote({
      title: "",
      content: ""
    });
    event.preventDefault();
  }

  function expand() {
    setExpanded(true);
  };

  return (
    <div>
      <form className="create-note">
        {isExpanded ? <input
          name="title"
          value={note.title}
          onChange={handleChange}
          placeholder="Title" /> : null}
        <textarea
          name="content"
          onClick={expand}
          value={note.content}
          onChange={handleChange}
          placeholder={isExpanded ? "Type your note here" : "Click here to leave a note"}
          rows={isExpanded ? 3 : 1} />
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote}>
            <Add />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
