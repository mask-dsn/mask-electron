// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Counter.css';
import routes from '../constants/routes';

type Props = {
  refresh: () => void,
  chain: string
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
        <div className={`board ${styles.counter}`} data-tid="chain">
          {chain}
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
