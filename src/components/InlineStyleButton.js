import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
import { ToolbarContext } from './ToolbarContext';
import { ToolbarButton as styles } from './styles';

export class InlineStyleButton extends PureComponent {
  static contextType = ToolbarContext;

  constructor(props) {
    super(props);
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
  }

  toggleInlineStyle(event) {
    event.preventDefault();
    const { value } = this.props;
    if (value instanceof Array) this.context.toggleInlineStyleArray(value);
    else this.context.toggleInlineStyle(value);
  }

  hasStyle() {
    const { value } = this.props;
    return value instanceof Array
      ? this.context.inlineStyles.has(value[0])
      : this.context.inlineStyles.has(value);
  }
  
  render() {
    const { classes, children } = this.props;

    return <Button className={classes.root}
      color={this.hasStyle() ? 'primary' : 'default'}
      onMouseDown={this.toggleInlineStyle}
    >
      {children}
    </Button>;
  }
}

export default withStyles(styles)(InlineStyleButton);