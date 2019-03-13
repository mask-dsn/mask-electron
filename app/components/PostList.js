import React, { Component } from 'react';
import Feed from './Feed';

export default class PostList extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const chain = this.props.chainObj.blockchain;
    return (
      <div>
        <ul>
          {chain.map((block, index) => (
            <Feed post={block.post} key={index} />
          ))}
        </ul>
      </div>
    );
  }
}
