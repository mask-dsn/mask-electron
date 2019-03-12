// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Board.css';
import routes from '../constants/routes';
import { Block } from "../utils/blockchain";

type Props = {
  refresh: () => void,
  chain: Block[]
};

export default class Board extends Component<Props> {
  props: Props;

  render() {
    const { refresh, chain } = this.props;
    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.HOME}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={`index ${styles.index}`} data-tid="index">
          Index: {chain[0].index}
        </div>
        <div className={`timestamp ${styles.timestamp}`} data-tid="timestamp">
          Timestamp: {chain[0].timestamp}
        </div>
        <div className={`data ${styles.data}`} data-tid="data">
          Data: {chain[0].data}
        </div>
        <div className={styles.btnGroup}>
          <button
            className={styles.btn}
            onClick={refresh}
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
