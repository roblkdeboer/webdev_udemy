import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {

  const [notes, setNotes] = React.useState([]);


  // Receiving the note from the CreateArea component
  // Add the new note to an array

  function addNote(newNote) {
    setNotes(prevNotes => {
      return [...prevNotes, newNote];
    });
  }

  // Delete the note that was clicked on by reading the ID of the note clicked on
  function deleteNote(id) {
    setNotes(prevNotes => {
      // Filter and create an array of notes aside from the notes where the ID matches the one that has been clicked on to be deleted
      return  prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div>
      <Header />
      <CreateArea
        onAdd={addNote}
      />
      {/* Render new Note components from the array of new notes */}
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={index}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;

