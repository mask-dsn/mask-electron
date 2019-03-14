import React, { Component } from 'react';
import style from './css/Feed.css';
import { getDateFromTimestamp } from '../utils/timestampUtil';

export default class Feed extends Component {
  render() {
    const userId = this.props.post.userId;
    const message = this.props.post.message;
    const timestamp = getDateFromTimestamp(this.props.post.timestamp);

    return (
      <div className={style.facebookbox}>
        <div className={style.content}>
          <div className={style.righticon}>
            <i className="material-icons">keyboard_arrow_down</i>
          </div>
          <div className={`${style.row} ${style.header}`}>
            <div className={style.avatar}>
              <img src="http://placehold.it/40x40" alt="" />
            </div>
            <div className={style.name}>
              <h5>{userId}</h5>
              <span className={style.sub}>{timestamp}</span>
            </div>
          </div>
          <div className={`${style.row} ${style.text}`}>{message}</div>
          <hr />
        </div>
        <div className={style.footer}>
          <a href="#">6 people</a> like this.
          <div className={style.row}>
            <div className={style.smallavatar}>
              <img src="http://placehold.it/32x32" alt="" />
            </div>
            <div className={style.writecomment}>
              <input type="text" placeholder="Write your comment..." />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
