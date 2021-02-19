import { useEffect, useState } from "react";
import { Editor, EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";

function SceneEditor({ setText, initialText }) {
  const [editorState, setEditorState] = useState(() =>
    initialText
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(initialText)))
      : EditorState.createEmpty()
  );

  useEffect(() => {}, []);
  return (
    <div>
      <div className="border w-full">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
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
