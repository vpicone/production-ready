import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Snackbar from "material-ui/Snackbar";
import IconButton from "material-ui/IconButton";
import CloseIcon from "material-ui-icons/Close";

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4
  }
});

class SimpleSnackbar extends Component {
  state = {
    open: true,
    message: null
  };

  handleRequestClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.props.clearErrorMessage();
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        open={this.state.open}
        autoHideDuration={3e3}
        onRequestClose={this.handleRequestClose}
        SnackbarContentProps={{
          "aria-describedby": "message-id"
        }}
        message={
          <span id="message-id">
            {this.props.children}
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={this.handleRequestClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    );
  }
}

SimpleSnackbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleSnackbar);
