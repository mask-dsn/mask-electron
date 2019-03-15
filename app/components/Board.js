import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './css/Board.css';
import routes from '../constants/routes';
import Postbox from './Postbox';
import Feed from './Feed';

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postChain: [],
      userChain: []
    };

    this.handleRefresh = this.handleRefresh.bind(this);

    this.handleRefresh();
  }

  handleRefresh() {
    axios.get('http://localhost:3001/blocks').then(res => {
      const postChain = res.data.reverse();
      this.setState({ postChain });
    });
    axios.get('http://localhost:3002/blocks').then(res => {
      const userChain = res.data.reverse();
      this.setState({ userChain });
    });
  }

  render() {
    return (
      <div>
        <Postbox userId={666} refresh={this.handleRefresh} />
        <div className={styles.btnGroup}>
          <button
            className={styles.btn}
            onClick={this.handleRefresh}
            data-tclass="btn"
            type="button"
          >
            Refresh
          </button>
        </div>
        <div className={styles.scrollbox}>
          {this.state.postChain.map((block, index) => (
            <Feed key={index} post={block.data} />
          ))}
        </div>
      </div>
    );
  }
}
