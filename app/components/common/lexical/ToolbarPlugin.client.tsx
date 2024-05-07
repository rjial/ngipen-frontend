/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_LOW,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from 'lexical';
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
    $isListNode,
    ListNode,
    insertList,
    removeList
} from "@lexical/list";
import {
    $isHeadingNode,
    $createHeadingNode,
    $createQuoteNode,
} from "@lexical/rich-text";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Italic, List, Redo, Strikethrough, Underline, Undo } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const LowPriority = 1;

function Divider() {
    return <div className="divider" />;
}

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [idUnorderedList, setIsUnorderedList] = useState(false);
    const [blockType, setBlockType] = useState("paragraph");
    const [selectedElementKey, setSelectedElementKey] = useState<string | null>(null);

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            const element = anchorNode.getKey() === "root"
                    ? anchorNode
                    : anchorNode.getTopLevelElementOrThrow();
            const elementKey = element.getKey();
            const elementDOM = editor.getElementByKey(elementKey);
            if (elementDOM !== null) {
                setSelectedElementKey(elementKey);
                if ($isListNode(element)) {
                  const parentList = $getNearestNodeOfType(anchorNode, ListNode);
                  const type = parentList ? parentList.getTag() : element.getTag();
                  setBlockType(type);
                } else {
                  const type = $isHeadingNode(element)
                    ? element.getTag()
                    : element.getType();
        
                  setBlockType(type);
                }
              }
            // Update text format
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
            setIsUnorderedList(blockType === "ul")
        }
    }, []);

    useEffect(() => {

        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, _newEditor) => {
                    $updateToolbar();
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(INSERT_UNORDERED_LIST_COMMAND, () => {
                insertList(editor, 'bullet');
                $updateToolbar();
                return true;
            }, COMMAND_PRIORITY_LOW),
            editor.registerCommand(REMOVE_LIST_COMMAND, () => {
                removeList(editor);
                $updateToolbar();
                return true;
            }, COMMAND_PRIORITY_LOW)
        );
    }, [editor, $updateToolbar]);

    return (
        <div className="toolbar" ref={toolbarRef}>
            <button
                disabled={!canUndo}
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND, undefined);
                }}
                className="toolbar-item spaced"
                aria-label="Undo">
                {/* <i className="format undo" /> */}
                <Undo size={16} />
            </button>
            <button
                disabled={!canRedo}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND, undefined);
                }}
                className="toolbar-item"
                aria-label="Redo">
                {/* <i className="format redo" /> */}
                <Redo size={16} />
            </button>
            <Divider />
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                }}
                className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
                aria-label="Format Bold">
                <Bold size={16} />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                }}
                className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
                aria-label="Format Italics">
                <Italic size={16} className='format' />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                }}
                className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
                aria-label="Format Underline">
                <Underline size={16} />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                }}
                className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
                aria-label="Format Strikethrough">
                <Strikethrough size={16} />
            </button>
            <Divider />
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
                }}
                className="toolbar-item spaced"
                aria-label="Left Align">
                <AlignLeft size={16} />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
                }}
                className="toolbar-item spaced"
                aria-label="Center Align">
                <AlignCenter size={16} />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
                }}
                className="toolbar-item spaced"
                aria-label="Right Align">
                <AlignRight size={16} />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
                }}
                className="toolbar-item"
                aria-label="Justify Align">
                <AlignJustify size={16}/>
            </button>
            <button
                onClick={() => {
                    if (blockType !== "ul") {
                        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
                    } else {
                        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
                    }
                }}
                className={cn("toolbar-item spaced", idUnorderedList ? "active" : "")}
                aria-label="Right Align">
                <List size={16} />
            </button>{' '}
        </div>
    );
}
