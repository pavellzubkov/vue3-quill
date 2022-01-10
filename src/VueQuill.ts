// <template>
//   <section ref="editor"></section>
// </template>
//
// <script lang="ts">
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import Quill, { QuillOptionsStatic } from 'quill'
import { onMounted, ref, watch, onUnmounted, onBeforeUnmount, defineComponent, h, PropType } from 'vue'

interface IEditorState {
  editorOption: QuillOptionsStatic
  quill: Quill
}

const defaultOptions: QuillOptionsStatic = {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['clean'],
      ['link', 'image', 'video'],
    ],
  },
  placeholder: 'Insert content here ...',
  readOnly: false,
}

export const QuillEditorDev = defineComponent({
  name: 'QuillEditorDev',
  props: {
    content: String as PropType<string>,
    value: String as PropType<any>,
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    options: {
      type: Object as PropType<QuillOptionsStatic>,
      required: false,
      default: () => ({}),
    },
  },
  emits: ['ready', 'change', 'input', 'blur', 'focus', 'update:value'],
  setup(props, context) {
    const state: IEditorState = {
      editorOption: {},
      quill: null,
    }

    let _content = ''

    watch(
      () => props.value,
      (val) => {
        if (state.quill) {
          if (val && val !== _content) {
            _content = val
            state.quill.pasteHTML(val)
          } else if (!val) {
            state.quill.setText('')
          }
        }
      },
    )

    watch(
      () => props.content,
      (val) => {
        if (state.quill) {
          if (val && val !== _content) {
            _content = val
            state.quill.pasteHTML(val)
          } else if (!val) {
            state.quill.setText('')
          }
        }
      },
    )

    watch(
      () => props.disabled,
      (val) => {
        if (state.quill) {
          state.quill.enable(!val)
        }
      },
    )

    const editor = ref(null)

    const mergeOptions = (def, custom) => {
      for (const key in custom) {
        if (!def[key] || key !== 'modules') {
          def[key] = custom[key]
        } else {
          mergeOptions(def[key], custom[key])
        }
      }
      return def
    }

    const initialize = () => {
      if (editor.value) {
        // Options
        state.editorOption = mergeOptions(defaultOptions, props.options)
        state.editorOption.readOnly = !!props.disabled
        // Instance
        state.quill = new Quill(editor.value, state.editorOption)
        // console.log('intilized')

        // Set editor content
        if (props.value) {
          state.quill.pasteHTML(props.value)
        }

        // Mark model as touched if editor lost focus
        state.quill.on('selection-change', (range) => {
          if (!range) {
            context.emit('blur', state.quill)
          } else {
            context.emit('focus', state.quill)
          }
        })
        // Update model if text changes
        state.quill.on('text-change', () => {
          // diabled editor after content initialized
          if (props.disabled) {
            state.quill.enable(false)
          }
          let html = editor.value.children[0].innerHTML
          const quill = state.quill
          const text = state.quill.getText()
          if (html === '<p><br></p>') html = ''
          _content = html
          context.emit('update:value', _content)
          context.emit('change', { html, text, quill })
        })

        // Emit ready event
        context.emit('ready', state.quill)
      }
    }

    onBeforeUnmount(() => {
      const editorToolbar = editor.value.previousSibling
      if (editorToolbar && editorToolbar.className.indexOf('ql-toolbar') > -1) {
        editorToolbar.parentNode.removeChild(editorToolbar)
      }
    })

    onMounted(() => {
      initialize()
    })

    onUnmounted(() => {
      state.quill = null
    })

    return { editor }
  },
  render() {
    return [h('selection', { ref: 'editor', ...this.$attrs })]
  },
})
// </script>
