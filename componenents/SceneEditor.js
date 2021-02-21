import { useEffect, useState } from "react";
import { Editor, EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import Head from "next/head";

function SceneEditor({ setText, initialText }) {
  const [editorState, setEditorState] = useState(() =>
    initialText
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(initialText)))
      : EditorState.createEmpty()
  );

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
      <div className="border w-full h-96 overflow-y-scroll pb-4">
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
