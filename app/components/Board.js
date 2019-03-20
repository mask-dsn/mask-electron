import React, { Component } from 'react';
import IPFS from 'ipfs';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './css/Board.css';
import routes from '../constants/routes';
import Postbox from './Postbox';
import Feed from './Feed';
import SearchAppBar from './SearchBar';

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      node: '',
      chain: [],
      chainCopy: [],
      imageArray: []
    };

    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.node = new IPFS();
    this.node.on('ready', async () => {
      this.setState({ node: this.node });
    });

    this.handleRefresh();
    this.bindImg();
  }

  handleRefresh() {
    axios.get('http://localhost:3001/blocks').then(res => {
      const chain = res.data.reverse();
      chain.map(block => {
        block.index = chain.indexOf(block);
      });
      this.setState({ chain, chainCopy: chain });
      this.bindImg();
    });
  }

  handleSearch(event) {
    const keyword = event.target.value;
    if (!keyword) {
      this.setState({ chain: this.state.chainCopy });
    } else {
      const chain = this.state.chainCopy.filter(post =>
        JSON.stringify(post)
          .toLowerCase()
          .includes(keyword)
      );
      this.setState({ chain });
    }
  }

  bindImg() {
    const imageArray = new Array(this.state.chain.length);
    this.state.chain.map(block => {
      if (block.post.ipfsPointer !== 'null') {
        axios
          .get(`https://ipfs.io/ipfs/${block.post.ipfsPointer}`)
          .then(res => {
            const image = res.data;
            imageArray[block.index] = image;

            this.setState({ imageArray });
          });
      } else {
        imageArray[block.index] = null;
        this.setState({ imageArray });
      }
    });
  }

  render() {
    return (
      <div>
        <SearchAppBar handleSearch={this.handleSearch} />
        <Postbox
          ipfs={this.state.node}
          userId="philzhan"
          refresh={this.handleRefresh}
        />
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
          {this.state.chain.map((block, index) => (
            <Feed
              image={this.state.imageArray[block.index]}
              key={index}
              post={block.post}
            />
          ))}
        </div>
      </div>
    );
  }
}
