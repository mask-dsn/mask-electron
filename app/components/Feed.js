import React, { Component } from 'react';
import './css/Feed.css';

export default class Feed extends Component {
  render() {
    return (
      <div className="facebook-box">
        <div className="content">
          <div className="right-icon">
            <i className="material-icons">keyboard_arrow_down</i>
          </div>
          <div className="row header">
            <div className="avatar">
              <img src="http://placehold.it/40x40" alt="" />
            </div>
            <div className="name">
              <h5>
                <a href="http://khoipro.com" target="_blank">
                  Khoi Nguyen
                </a>
              </h5>
              <span className="sub">10 October 2015 at 15:00</span>
            </div>
          </div>
          <div className="row text">
            Sed tristique dapibus velit. Sed at mauris porttitor, aliquam erat
            eu, mollis quam. Morbi sit amet dignissim turpis. Proin sed dui
            nisl. Quisque lorem risus, cursus eget metus nec, lobortis varius
            massa.
          </div>
          <div className="row thumbnail">
            <img src="http://placehold.it/600x350" alt="" />
          </div>
          <hr />
        </div>
        <div className="footer">
          <a href="#">6 people</a> like this.
          <div className="row">
            <div className="small-avatar">
              <img src="http://placehold.it/32x32" alt="" />
            </div>
            <div className="write-comment">
              <input type="text" placeholder="Write your comment..." />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
