import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './css/Postbox.css';
import { Post } from '../utils/Post';
import Popup from './ImageUploader/Popup';

export default class Postbox extends Component {
  constructor(props) {
    super(props);
    this.state = { postContent: '', userId: this.props.userId, showPopup: false, postImage: null, showImageName: false };

    this.handleChange = this.handleChange.bind(this);
    this.handlePost = this.handlePost.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.handleImage = this.handleImage.bind(this);
  }

  handleChange(event) {
    this.setState({ postContent: event.target.value });
  }

  handleImage(image) {
    this.setState({ postImage: image, showImageName: true });
    this.togglePopup();
    console.log(image);
  }

  handlePost(event) {
    event.preventDefault();
    console.log(`Posting data: ${this.state.postContent}`);
    axios
      .post(
        'http://localhost:3001/mineBlock',
        new Post(this.props.userId, this.state.postContent, new Date())
      )
      .then(response => {
        this.props.refresh();
      })
      .catch(error => {
        console.log(error);
      });
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  render() {
    return (
      <section>
        <div>
          <img src="http://i.pravatar.cc/100" />
          <form onSubmit={this.handlePost}>
            <textarea
              placeholder="What's in your mind?"
              value={this.state.postContent}
              onChange={this.handleChange}
            />
            <input type="submit" value="Post" />
          </form>
          <button className={styles.uploadbtn} onClick={this.togglePopup}>Upload Image</button>
          {this.state.showImageName ?
            <h1>{'Image attached.'}</h1>
            : null
          }
        </div>
          {this.state.showPopup ?
            <Popup
              closePopup={this.togglePopup}
              handleImage={this.handleImage}
            />
            : null
          }
      </section>
    );
  }
}
