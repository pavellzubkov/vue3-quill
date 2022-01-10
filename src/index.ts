import Quill from 'quill'
import { QuillEditorDev } from './VueQuill'

QuillEditorDev.install = function (app) {
  app.component(QuillEditorDev.name, QuillEditorDev)
}

const VueQuillEditor = { Quill, QuillEditorDev }
export default VueQuillEditor
export { Quill, QuillEditorDev }
