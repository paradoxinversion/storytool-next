import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  RichUtils,
} from "draft-js";
import "draft-js/dist/Draft.css";
import Head from "next/head";
import StyleButton from "./draft/StyleButton";
import { throttle } from "lodash";
import { updateSceneText } from "../clientActions/scene";
const INLINE_STYLES = [
  { label: "Bold", style: "BOLD" },
  { label: "Italic", style: "ITALIC" },
  { label: "Underline", style: "UNDERLINE" },
  { label: "Monospace", style: "CODE" },
];

function SceneEditor({ setText, initialText, sceneId }) {
  const [editorState, setEditorState] = useState(() =>
    initialText
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(initialText)))
      : EditorState.createEmpty()
  );
  const editor = React.useRef(null);

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      console.log(newState);
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  const getText = () => {
    console.log(editorState.getCurrentContent().getPlainText());
  };

  const saveSceneText = (editorState) => {
    console.log(editorState.getCurrentContent().getPlainText());
    updateSceneText(
      sceneId,
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
  };
  const throttledGetText = useRef(throttle((test) => console.log(test), 3000));
  const throttledSave = useRef(
    throttle((editorState) => saveSceneText(editorState), 3000)
  );
  const toggleInlineStyle = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const onChange = (editorState) => {
    // If there's a sceneId passed in, we're editing scene and should autosave
    if (sceneId) {
      throttledSave.current(editorState);
    }
    // throttledGetText.current(editorState.getCurrentContent().getPlainText());
    setEditorState(editorState);
    // setText(JSON.stringify(convertToRaw(editorState.getCurrentContent())));
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
      <header></header>
      <div id="editor-controls">
        {INLINE_STYLES.map((type) => (
          <StyleButton
            key={type.label}
            active={editorState.getCurrentInlineStyle().has(type.style)}
            label={type.label}
            onToggle={toggleInlineStyle}
            style={type.style}
          />
        ))}
      </div>
      <p className="text-xs">
        The scene editor is a work in progress. If style buttons don't work, try
        ctrl+key instead.
      </p>
      <div
        className="border w-full h-96 overflow-y-scroll p-2 rounded"
        // onClick={focusEditor}
      >
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={onChange}
          handleKeyCommand={handleKeyCommand}
          placeholder="What happens?"
          spellCheck
          onBlur={() => {}}
        />
      </div>
    </div>
  );
}

export default SceneEditor;
