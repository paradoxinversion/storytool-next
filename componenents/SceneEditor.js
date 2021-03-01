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
  const [sceneSaved, setSceneSaved] = useState(true);
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

  const getWordCount = (editorState) => {
    return editorState
      .getCurrentContent()
      .getPlainText(" ")
      .split(" ")
      .filter((word) => word.length > 0).length;
  };

  const saveSceneText = async (editorState) => {
    await updateSceneText(
      sceneId,
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
    setSceneSaved(true);
  };
  const throttledSave = useRef(
    throttle((editorState) => saveSceneText(editorState), 3000)
  );
  const toggleInlineStyle = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  // This fires even on click and blur
  const onChange = (editorState) => {
    // If there's a sceneId passed in, we're editing scene and should autosave
    setSceneSaved(false);
    if (sceneId) {
      throttledSave.current(editorState);
    }
    setEditorState(editorState);
  };
  useEffect(() => {
    if (!initialText) return;
    setEditorState(
      EditorState.createWithContent(convertFromRaw(JSON.parse(initialText)))
    );
  }, [initialText]);
  return (
    <div id="scene-editor" className="flex flex-col h-full max-h-full">
      <Head>
        <meta charset="utf-8" />
      </Head>
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
        className="border flex-grow p-2 rounded overflow-y-scroll"
        // onClick={focusEditor}
      >
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={onChange}
          handleKeyCommand={handleKeyCommand}
          placeholder="What happens?"
          spellCheck
        />
      </div>
      {sceneId && (
        <p
          className={`text-sm ${
            sceneSaved ? "text-green-400" : "text-red-200"
          }`}
        >
          {sceneSaved ? "Saved" : "You have unsaved work"}
        </p>
      )}
      <p>Word Count: {getWordCount(editorState)}</p>
    </div>
  );
}

export default SceneEditor;
