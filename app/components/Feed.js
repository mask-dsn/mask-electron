import React, { Component } from 'react';
import style from './css/Feed.css';

export default class Feed extends Component {
  render() {
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
              <h5>
                <a href="http://khoipro.com" target="_blank">
                  Khoi Nguyen
                </a>
              </h5>
              <span className={style.sub}>10 October 2015 at 15:00</span>
            </div>
          </div>
          <div className={`${style.row} ${style.text}`}>
            {this.props.post.message}
          </div>
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
