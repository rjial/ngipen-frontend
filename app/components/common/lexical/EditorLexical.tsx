import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import ToolbarPlugin from "./ToolbarPlugin.client";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalTheme from "./LexicalTheme";
import './lexical-style.css'
import { ListItemNode, ListNode } from "@lexical/list";
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import { EditorState } from "lexical";

const EditorLexical = ({handleChange, defaultState}: {handleChange: (editorState: EditorState) => void, defaultState?: string}) => {
    return (
        <LexicalComposer
            initialConfig={{
                editorState: defaultState != undefined ? defaultState : '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                namespace: "desc",
                nodes: [
                    ListNode,
                    ListItemNode
                ],
                onError(error, editor) {
                    console.log(error)
                },
                theme: LexicalTheme
            }}>
            <ToolbarPlugin />
            <RichTextPlugin
                contentEditable={<ContentEditable
                    placeholder="asdasdasd"
                    className="min-h-64 p-4"
                    onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                />}
                placeholder={<div className="editor-placeholder">Enter some rich text...</div>}
                ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <OnChangePlugin onChange={handleChange} />
        </LexicalComposer>
    )
}

export {EditorLexical}