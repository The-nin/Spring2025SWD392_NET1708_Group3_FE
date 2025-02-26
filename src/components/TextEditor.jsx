import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles

const TextEditor = () => {
  const [text, setText] = useState("");

  return (
    <div className="editor-container">
      <h2>Online Text Editor</h2>
      <ReactQuill theme="snow" value={text} onChange={setText} />
      <div className="output">
        <h3>Preview:</h3>
        <div dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </div>
  );
};

export default TextEditor;
