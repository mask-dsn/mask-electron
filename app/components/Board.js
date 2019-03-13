import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Board.css';
import routes from '../constants/routes';
import PostList from './PostList';
import Postbox from './Postbox';
import { Chain } from '../utils/Chain';
import { connect } from '../utils/tracker';

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peers: [],
      chainObj: { blockchain: [] }
    };
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    connect().then(peers => {
      this.setState({ peers, chainObj: new Chain(peers) });
    });
  }

  refresh() {}

  render() {
    return (
      <div>
        <Postbox usrId={666} chainObj={this.state.chainObj} />

        <div className={styles.btnGroup}>
          <button
            className={styles.btn}
            onClick={this.refresh}
            data-tclass="btn"
            type="button"
          >
            Refresh
          </button>
        </div>
        <PostList chainObj={this.state.chainObj} />
      </div>
    );
  }
}
