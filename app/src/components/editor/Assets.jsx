import React from 'react';

import {RingaComponent, Button, ModalToggleContainer, TextInput} from 'ringa-fw-react';

import APIController from '../../controllers/APIController';

import './Assets.scss';

export default class Assets extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.state = {
      showUpload: false,
      assetId: ''
    };

    this.canvas = document.createElement('canvas');
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  renderAsset(asset, ix, arr) {
    const dataUrl = asset.asset ? `data:${asset.contentType};base64,${asset.asset}` : '';

    return <div className="asset">
      {dataUrl ? <img src={dataUrl} /> : undefined}
      <div className="assetId">{asset.assetId || 'Untitled'}</div>
      <div className="size">{Math.round(asset.byteSize / 1024)}kb</div>
    </div>;
  }

  renderAssets() {
    const {assets} = this.props.game;

    return <div className="assets-tile">
      {assets ? assets.map(this.renderAsset) : 'No assets available'}
    </div>;
  }

  render() {
    const {showUpload, assetId} = this.state;
    const {assets} = this.props.game;

    const totalSize = assets ? assets.map(a => a.byteSize).reduce((i, a) => a + i, 0) : 0;

    return <div className="assets">
      <div className="total-size">{Math.round(totalSize / 1024)} kb</div>
      {this.renderAssets()}
      <Button label="Upload Asset" onClick={this.upload_onClickHandler}/>
      <ModalToggleContainer title="Upload Assets" show={showUpload} position="centered">
        <label>Asset ID</label>
        <TextInput value={assetId} onChange={event => {this.setState({assetId: event.target.value})}}/>
        <input type="file" ref="fileInput" onChange={this.fileSelector_onChangeHandler} />
      </ModalToggleContainer>
    </div>;
  }


  //-----------------------------------
  // Events
  //-----------------------------------
  upload_onClickHandler() {
    this.setState({showUpload: true});
  }

  fileSelector_onChangeHandler(event) {
    this.dispatch(APIController.ADD_ASSET, {
      gameId: this.props.game.id,
      assetId: this.state.assetId,
      groupId: '',
      description: '',
      type: '',
      file: this.refs.fileInput.files[0]
    });
  }
}
