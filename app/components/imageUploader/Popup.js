import React, { Component } from 'react';
import styles from '../imageUploader/css/Popup.css';
import ImageUpload from '../imageUploader/ImageUpload';

export default class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {text: 'Upload Image'};
  }

  render() {
    return (
      <div className={styles.popup}>
        <div className={styles.popup_inner}>
          <h3>{this.state.text}</h3>
          <ImageUpload className={styles.upload} />
          <button className={styles.closeButton} onClick={this.props.closePopup}>Close</button>
        </div>
      </div>
    );
  }
};
