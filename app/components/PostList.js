import React, { Component } from 'react';
import Feed from './Feed';

export default class PostList extends Component {
  render() {
    return (
      <div>
        <ul>
          {this.props.chain.map((block, index) => (
            <Feed data={block.data} key={index} />
          ))}
        </ul>
      </div>
    );
  }
}
