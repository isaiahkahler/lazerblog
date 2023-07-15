"use client";

import Container from "@/ui/container";
import Input, { InputContainer, InputLabel, InputTextArea } from "@/ui/input";
import Layout from "@/ui/layout";
import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import List from '@editorjs/list'
import Warning from '@editorjs/warning'
import Code from '@editorjs/code'
import LinkTool from '@editorjs/link'
// import Image from '@editorjs/image'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import { MutableRefObject, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/data/store";
import EditorJS, { EditorConfig } from "@editorjs/editorjs";
import { Blocks } from "@editorjs/editorjs/types/api";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import Editor from "@/ui/editor";
import Button from "@/ui/button";
import styles from './new-post.module.css';
// import SimpleImage from '@editorjs/simple-image'
import animationStyles from '@/styles/animations.module.css';
import { Animations, useAnimationTransition } from "@/hooks/useAnimationTransition";
import editorRenderer from 'editorjs-html';


export default function NewPost() {
  const router = useRouter();
  const user = useStore(state => state.user);
  const userLoading = useStore(state => state.userLoading);

  // TODO: replace with next redirect
  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.push('/login');
    }
  }, [router, user, userLoading])

  // get drafts
  useEffect(() => { }, []);

  // get blogs 
  useEffect(() => { }, []);


  const handleSaveDraft = () => { };

  const handleSendPost = () => { };


  return <NewPostUI />
}




interface NewPostUIProps {

}

function NewPostUI() {
  // const [editorContent, setEditorContent] = useState<Blocks | null>(null);

  // const editorCore = useRef<EditorCore>(null)

  // const handleInitialize = useCallback((instance) => {
  //   editorCore.current = instance
  // }, [])

  const [isSaving, setIsSaving] = useState(false);

  const [spinner, setSpinner] = useState(false);

  const editorRef = useRef<EditorJS>();

  const [resultingHTML, setResultingHTML] = useState<string[]>([]);

  const {showElement: showOverlay, transitionEntrance: fadeInClass, transitionExit: fadeOutClass} = useAnimationTransition(isSaving, { entrance: Animations.FadeIn, exit: Animations.FadeOut });

  const handleSave = useCallback(async () => {
    // const savedData = await editorCore.current.save();
    if (!editorRef) return;
    if (!editorRef.current) return;
    setIsSaving(true);
    const output = await editorRef.current.save();
    console.log('save output:', JSON.stringify(output))
    setTimeout(() => setIsSaving(false), 1200);
    const parser = editorRenderer();
    setResultingHTML(parser.parse(output))

  }, [editorRef]);


  // useEffect(() => {
  //   console.log({ editorContent });

  // }, [editorContent])

  const overlay = isSaving;

  return (
    <Layout>
      <Container>
        <h1>Create a New Post</h1>
        <p>Write anything!</p>
        <hr />
        <div className={styles.editorContainer} style={{ opacity: overlay ? 0.5 : 1 }}>
          <Editor
            reactRef={editorRef}
            initialEditorConfig={{
              placeholder: 'Start writing...',
              tools: {
                embed: Embed,
                table: Table,
                marker: Marker,
                list: List,
                warning: Warning,
                code: Code,
                linkTool: LinkTool,
                // image: Image,
                header: {
                  class: Header, config: {
                    placeholder: 'Title',
                    levels: [1,2,3],
                    defaultLevel: 1
                  }
                },
                quote: Quote,
                checklist: CheckList,
                delimiter: Delimiter,
                inlineCode: InlineCode,
                // simpleImage: SimpleImage,
              },
              data: {
                blocks: [
                  { "id": "dgGN2hApKw", "type": "header", "data": { "text": "", "level": 1, "placeholder": 'Title' } }, { "id": "c7y2pcQ3kY", "type": "paragraph", "data": { "text": "" } }
                ]
              }
              // data: {"time":1687877317241,"blocks":[{"id":"v0N6OcWBKk","type":"paragraph","data":{"text":"kawaii"}},{"id":"Lm9iwKFTo5","type":"header","data":{"text":"MiCK NUGGET","level":2}},{"id":"-U2FQ3lOkp","type":"code","data":{"code":"some code goes here"}}],"version":"2.27.2"},
              // readOnly: true,
            }}
          />

          {/* overlay for loading / saving state */}
          {
            showOverlay &&
            <div className={`${styles.overlayContainer} ${fadeInClass} ${fadeOutClass}`}>
              {isSaving &&
                <>
                  <p>Saving...</p>
                  <Icon path={mdiLoading} size={1.2} spin />
                </>
              }
            </div>
          }
        </div>

        <div dangerouslySetInnerHTML={{ __html: resultingHTML.join(' ') }}></div>


        <Button onClick={handleSave}><p>save</p></Button>
      </Container>
    </Layout>
  );
}