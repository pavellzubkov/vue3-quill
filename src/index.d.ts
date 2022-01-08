import Quill, { QuillOptionsStatic } from 'quill'

declare module 'vue3-quill'

export interface IEditorState {
  editorOption: QuillOptionsStatic
  quill: Quill
}
