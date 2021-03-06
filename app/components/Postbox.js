import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './css/Postbox.css';
import { Post } from '../utils/Post';
import Popup from './ImageUploader/Popup';
import IPFS from 'ipfs';

export default class Postbox extends Component {
  constructor(props) {
    super(props);
    this.state = { postContent: '', userId: this.props.userId, showPopup: false, postImage: null, showImageName: false, imageHash: 'null' };

    this.handleChange = this.handleChange.bind(this);
    this.handlePost = this.handlePost.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.uploadImg = this.uploadImg.bind(this);
  }

  handleChange(event) {
    this.setState({ postContent: event.target.value });
  }

  handleImage(pathUrl, imageData) {
    this.togglePopup();
    console.log(imageData);
    console.log(pathUrl.path);
    this.uploadImg(this.props.ipfs, pathUrl.path, imageData);
    this.setState({ postImage: imageData, showImageName: true});
  }

  async uploadImg(node, imagePath, ImageData){
    const files = Buffer(ImageData);
    const filesAdded = await node.add(files);
    const imageHash = filesAdded[0].hash;
    this.setState({imageHash: imageHash});
    console.log('Added file:', filesAdded[0].path, filesAdded[0].hash);
  }

  handlePost(event) {
    event.preventDefault();
    console.log(`Posting data: ${this.state.postContent} and ${this.state.imageHash}`);
    axios
      .post(
        'http://localhost:3001/mineBlock',
        new Post(this.props.userId, this.state.postContent, this.state.imageHash, new Date())
      )
      .then(response => {
        this.props.refresh();
      })
      .catch(error => {
        console.log(error);
      });
    // reset the image upload
    this.setState({ postImage: null, showImageName: false, postContent: '', imageHash: 'null'});
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
