import React, { useEffect, useState } from "react";
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  RichUtils,
} from "draft-js";
import "draft-js/dist/Draft.css";
import Head from "next/head";

function SceneEditor({ setText, initialText }) {
  const [editorState, setEditorState] = useState(() =>
    initialText
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(initialText)))
      : EditorState.createEmpty()
  );
  const editor = React.useRef(null);

  function focusEditor() {
    editor.current.focus();
  }

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      console.log(newState);
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };
  useEffect(() => {
    if (!initialText) return;
    setEditorState(
      EditorState.createWithContent(convertFromRaw(JSON.parse(initialText)))
    );
  }, [initialText]);
  return (
    <div>
      <Head>
        <meta charset="utf-8" />
      </Head>
      <div
        className="border w-full h-96 overflow-y-scroll p-2 rounded"
        onClick={focusEditor}
      >
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          placeholder="What happens?"
          spellCheck
          onBlur={() => {
            setText &&
              setText(
                JSON.stringify(convertToRaw(editorState.getCurrentContent()))
              );
          }}
        />
      </div>
    </div>
  );
}

export default SceneEditor;
