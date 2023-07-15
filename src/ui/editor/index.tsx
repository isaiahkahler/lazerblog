"use client";

import { MutableRefObject, useCallback, useEffect, useId, useState } from "react";
import EditorJS, { EditorConfig } from '@editorjs/editorjs'
import styles from './editor.module.css'
import DragDrop from 'editorjs-drag-drop';
// import Undo from 'editorjs-undo';

interface EditorProps {
  reactRef?: MutableRefObject<EditorJS | undefined>,
  initialEditorConfig: EditorConfig
}


// based off https://github.com/shadcn/taxonomy/blob/main/components/editor.tsx !!
export default function Editor(props: EditorProps) {
  const { reactRef, initialEditorConfig } = props;
  const id = useId();
  const [isMounted, setIsMounted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // useEffect(() => console.log('reactRef changed:', !!reactRef), [reactRef]);
  // useEffect(() => console.log('id changed:', !!id), [id]);
  // useEffect(() => console.log('rest changed:', !!rest), [rest]);


  // initialize function using EditorJS
  const initializeEditor = useCallback(async () => {
    if (!reactRef) return;
    if (reactRef.current) return;
    console.log('this better not run twice')
    const editor = new EditorJS({
      ...initialEditorConfig,
      holder: id,
      onReady: () => { 
        reactRef.current = editor;
        new DragDrop(editor);
        // new Undo({editor});
      }
    });
  }, [id, reactRef]);

  // useEffect(() => console.log('initializeEditor changed:', !!initializeEditor), [initializeEditor]);
  // useEffect(() => console.log('reactRef changed:', !!reactRef), [reactRef]);
  // useEffect(() => console.log('isMounted changed:', !!isMounted), [isMounted]);
  // useEffect(() => console.log('isInitialized changed:', !!isInitialized), [isInitialized]);


  // if there is a valid window object, set mounted and tell
  // browser to ask the user before navigating away
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.onbeforeunload = () => true;
    console.log('editor mounted');
    setIsMounted(true);
    return () => { window.onbeforeunload = null };
  }, []);

  // initialize the editor once mounted
  useEffect(() => {
    const cleanup = () => {
      // only cleanup when ref present, mounted, and initialized 
      if (!reactRef) return;
      if (!isMounted) return;
      if (!isInitialized) return;
      reactRef.current?.destroy();
      reactRef.current = undefined;
      console.log('destroyed ref')
    };

    // only initialize when ref present, not yet mounted, and not yet initialized
    if (!reactRef) return;
    if (!isMounted) return;
    if (isInitialized) return cleanup;
    console.log('initializing editor');
    initializeEditor();
    setIsInitialized(true);
    return cleanup;
  }, [initializeEditor, isMounted, reactRef, isInitialized])

  // return <div id={id} {...divOptions} />;
  return <div id={id} className={styles.editor} />;
}
