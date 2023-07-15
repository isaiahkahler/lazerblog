declare module "@editorjs/embed" {
  import Embed from "@editorjs/embed";
  export = Embed;
}

declare module "@editorjs/table" {
  import Table from "@editorjs/table";
  export = Table;
}

declare module "@editorjs/list" {
  import List from "@editorjs/list";
  export = List;
}
declare module "@editorjs/warning" {
  import Warning from "@editorjs/warning";
  export = Warning;
}

declare module "@editorjs/code" {
  import Code from "@editorjs/code";
  export = Code;
}
declare module "@editorjs/link" {
  import LinkTool from "@editorjs/link";
  export = LinkTool;
}
declare module "@editorjs/image" {
  import Image from "@editorjs/image";
  export = Image;
}
declare module "@editorjs/header" {
  import Header from "@editorjs/header";
  export = Header;
}
declare module "@editorjs/quote" {
  import Quote from "@editorjs/quote";
  export = Quote;
}
declare module "@editorjs/marker" {
  import Marker from "@editorjs/marker";
  export = Marker;
}
declare module "@editorjs/checklist" {
  import CheckList from "@editorjs/checklist";
  export = CheckList;
}
declare module "@editorjs/delimiter" {
  import Delimiter from "@editorjs/delimiter";
  export = Delimiter;
}
declare module "@editorjs/inline-code" {
  import InlineCode from "@editorjs/inline-code";
  export = InlineCode;
}

declare module "@editorjs/simple-image" {
  import SimpleImage from "@editorjs/simple-image";
  export = SimpleImage;
}


declare module 'editorjs-drag-drop' {
  export default class DragDrop {
    constructor(editor: any);
  }
}

// declare module 'editorjs-undo' {
//   export default class Undo {
//     constructor(editor: any);
//   }
// }