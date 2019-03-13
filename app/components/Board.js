import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Board.css';
import routes from '../constants/routes';
import Postbox from './Postbox';
import { Chain } from '../utils/Chain';
import { connect } from '../utils/tracker';

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peers: [],
      chainObj: {}
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
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.HOME}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>

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
      </div>
    );
  }
}
