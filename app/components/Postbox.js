import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './css/Postbox.css';
import { Post } from '../utils/Post';

export default class Postbox extends Component {
  constructor(props) {
    super(props);
    this.state = { postContent: '', userId: this.props.userId };

    this.handleChange = this.handleChange.bind(this);
    this.handlePost = this.handlePost.bind(this);
  }

  handleChange(event) {
    this.setState({ postContent: event.target.value });
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
        </div>
      </section>
    );
  }
}