import React from 'react';

import {RingaComponent, Button, ModalToggleContainer, TextInput, ModalModel, Alert} from 'ringa-fw-react';

import APIController from '../../controllers/APIController';

import './Assets.scss';

class AssetModalImage extends RingaComponent {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const {modal, asset} = this.props;
    const {naturalWidth, naturalHeight} = this.refs.image;

    modal.title = `${asset.assetId}, ${naturalWidth}x${naturalHeight}, ${asset.byteSize} bytes, ${asset.contentType}`;
  }

  render() {
    const {asset} = this.props;

    const dataUrl = asset.asset ? `data:${asset.contentType};base64,${asset.asset}` : '';

    return <div className="content">{dataUrl ? <img src={dataUrl} ref="image" /> : undefined}</div>;
  }
}

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

    return <div className="asset" onClick={this.asset_onClickHandler.bind(this, asset)} key={asset.assetId}>
      {dataUrl ? <img src={dataUrl} ref={`img${asset.assetId}`} /> : undefined}
      <div className="assetId">{asset.assetId || 'Untitled'}</div>
      <div className="size">{Math.round(asset.byteSize / 1024)}kb</div>
      <Button className="delete"
              onClick={this.asset_deleteOnClickHandler.bind(this, asset)}>
        <i className="fa fa-trash" />
      </Button>
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
      <div className="actions">
        <Button label="Upload Asset"
                className="green"
                onClick={this.upload_onClickHandler}/>
        <div className="total-size">{assets.length} Assets, {Math.round(totalSize / 1024)} kb Total</div>
      </div>
      {this.renderAssets()}
      <ModalToggleContainer title="Upload Assets"
                            show={showUpload}
                            classes="asset-upload-modal"
                            position="centered">
        <label>Asset ID</label>
        <TextInput value={assetId}
                   onChange={event => {this.setState({assetId: event.target.value})}}
                   classes="input-asset-id" />
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
    }).then($lastPromiseResult => {
      this.props.game.assets = $lastPromiseResult.assets;
      this.setState({showUpload: false});
    });
  }

  asset_onClickHandler(asset) {
    const img = this.refs[`img${asset.assetId}`];

    const assetModal = ModalModel.show({
      title: '',
      classes: 'asset-modal',
      renderer: AssetModalImage,
      rendererProps: {
        asset
      },
      position: 'centered',
      draggable: true,
      width: Math.min(img.naturalWidth + 50, window.innerWidth - 100),
      height: Math.min(img.naturalHeight + 50, window.innerHeight - 100)
    });
  }

  asset_deleteOnClickHandler(asset, event) {
    event.stopPropagation();

    Alert.show(`Are you sure you want to completely delete ${asset.assetId}?`, Alert.YES_NO, undefined, this.rootDomNode).then(result => {
      if (result.id === 'yes') {
        this.dispatch(APIController.DELETE_ASSET, {
          gameId: this.props.game.id,
          assetId: asset.assetId
        }).then($lastPromiseResult => {
          this.props.game.assets = $lastPromiseResult.assets;
          this.forceUpdate();
        });
      }
    });
  }
}
