import React, { Component } from 'react';
import style from './css/Feed.css';
import { getDateFromTimestamp } from '../utils/timestampUtil';

export default class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newComment: "",
      comments: []
    };

    this.handleComment = this.handleComment.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleComment(event) {
    if (this.state.newComment != "") {
      var c = this.state.comments;
      c.push(this.state.newComment);

      this.setState({comments: c});
      this.setState({newComment: ""});
    }
  }

  handleChange(event) {
    this.setState({ newComment: event.target.value });
  }

  render() {
    const userId = this.props.post.userId;
    const message = this.props.post.message;
    const timestamp = getDateFromTimestamp(this.props.post.timestamp);

    const avatarUrl = `https://avatars.dicebear.com/v2/avataaars/${userId}.svg`;
    const currentUserAvatar = `https://avatars.dicebear.com/v2/avataaars/${this.props.currentUser}.svg`;

    var jsx = [];
    for (var i=0; i<this.state.comments.length; i++) {
      jsx.push(<div key={i} className={`${style.comment}`}><div className={style.smallavatar}><img src={currentUserAvatar} alt="" /></div><div className={`${style.msg} ${style.text}`}>{this.state.comments[i]}</div></div>);
    }

    return (
      <div className={style.facebookbox}>
        <div className={style.content}>
          <div className={style.righticon}>
            <i className="material-icons">keyboard_arrow_down</i>
          </div>
          <div className={`${style.row} ${style.header}`}>
            <div className={style.avatar}>
              <img src={avatarUrl} />
            </div>
            <div className={style.name}>
              <h5>{userId}</h5>
              <span className={style.sub}>{timestamp}</span>
            </div>
          </div>
          <div className={`${style.row} ${style.text}`}>{message}</div>
          <div className={`${style.row} ${style.text}`}>
            <img src={this.props.image} />
          </div>

        </div>
        <div className={style.footer}>
          <a href="#">6 people</a> like this.
          
          {jsx}

          <div className={style.row}>
            <div className={style.smallavatar}>
              <img src={currentUserAvatar} alt="" />
            </div>
            <div className={style.writecomment}>
              <input type="text" onChange={this.handleChange} placeholder="Write your comment..." value={this.state.newComment}  />
              <button className={style.postbtn} type="submit" onClick={this.handleComment}>Post</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
