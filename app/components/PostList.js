// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './PostList.css';
import routes from '../constants/routes';
import { Block } from '../utils/blockchain';

type Props = {};

export default class PostList extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <h1>list</h1>
      </div>
    );
  }
}
