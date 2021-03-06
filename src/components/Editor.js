import React, { PureComponent } from 'react';
import { Editor as DraftEditor, EditorState } from 'draft-js';
import { withStyles } from "@material-ui/core/styles";
import { handleKeyCommand } from '../internals/handleKeyCommand';
import { handlePastedText } from '../internals/handlePastedText';
import { handleDrop } from '../internals/handleDrop';
import { handleDroppedFiles } from '../internals/handleDroppedFiles';
import { blockStyleFn } from '../internals/blockStyleFn';
import { customStyleFn } from '../internals/customStyleFn';
import { createEditorStateFromContent } from '../createEditorStateFromContent';
import { EditorContext } from './EditorContext';
import Toolbar from './Toolbar';
import { Editor as styles } from './styles';
import './draft_editor_styles.css';

class Editor extends PureComponent {
  constructor(props) {
    super(props);
    this.root = React.createRef();

    this.onChange = this.onChange.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.handlePastedText = this.handlePastedText.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDroppedFiles = this.handleDroppedFiles.bind(this);

    const getEditorState = () => this.props.editorState;
    const setEditorState = this.onChange;
    const getReadOnly = () => this.props.readOnly;
    this.editorContext = {
      get editorState() {
        return getEditorState();
      },
      set editorState(value) {
        setEditorState(value);
      },
      filesAndUrls: [],
      get readOnly() {
        return getReadOnly();
      }
    };
  }
  
  onChange(editorState) {
    if (this.props.readOnly) return;
    this.props.onChange?.(editorState);
  }

  handleKeyCommand(command, editorState) {
    const newState = handleKeyCommand(command, editorState);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  handlePastedText(text, html, editorState) {
    if (!html) return false;
    handlePastedText(html, editorState, this.editorContext.filesAndUrls)
    |> this.onChange(#);
    return true;
  }

  handleDrop(selection, dataTransfer) {
    const html = dataTransfer.getHTML();
    if (!html) return false;
    handleDrop(selection, html, this.editorState, this.editorContext.filesAndUrls)
    |> this.onChange(#);
    return true;
  }

  handleDroppedFiles(selection, files) {
    const newState = handleDroppedFiles(selection, files, this.editorState);
    if (newState) this.onChange(newState);
    //return true;
  }

  render() {
    const { classes, editorState, onFocus, onBlur, placeholder, readOnly = false } = this.props;
    this.editorState = editorState instanceof EditorState ? editorState : createEditorStateFromContent(editorState);

    return <div className={readOnly ? undefined : classes.root}>

      {!readOnly && <Toolbar editorState={this.editorState} onChange={this.onChange} />}
      
      <div ref={this.root} className={classes.content} style={readOnly ? undefined : { paddingTop: '16px' }}>
        <EditorContext.Provider value={this.editorContext}>
          <DraftEditor
            editorState={this.editorState}
            onChange={this.onChange}
            handleKeyCommand={this.handleKeyCommand}
            handlePastedText={this.handlePastedText}
            handleDrop={this.handleDrop}
            handleDroppedFiles={this.handleDroppedFiles}
            blockStyleFn={blockStyleFn}
            customStyleFn={customStyleFn}
            onFocus={onFocus}
            onBlur={onBlur}
            readOnly={readOnly}
            placeholder={placeholder}
          />
        </EditorContext.Provider>
      </div>
      
    </div>;
  }
}

export default withStyles(styles)(Editor);

