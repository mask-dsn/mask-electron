import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Postbox.css';

export default class Postbox extends Component {
  constructor(props) {
    super(props);
    this.state = { postContent: '' };
    this.chainObj = this.props.chainObj;

    this.handleChange = this.handleChange.bind(this);
    this.handlePost = this.handlePost.bind(this);
  }

  handleChange(event) {
    this.setState({ postContent: event.target.value });
  }

  handlePost(event) {
    console.log(`Posting data: ${this.state.postContent}`);
    this.props.chainObj.postNewBlock(this.state.postContent);
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
