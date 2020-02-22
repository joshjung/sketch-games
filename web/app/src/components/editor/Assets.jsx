import React from 'react';

import {RingaComponent, Button, ModalToggleContainer, TextInput, ModalModel, Alert} from 'ringa-fw-react';

import APIController from '../../controllers/APIController';

import './Assets.scss';

class AssetModalImage extends RingaComponent {
  constructor(props) {
    super(props);

    this.state = {
      assetChanged: false
    };
  }

  componentDidUpdate() {
    const {modal, asset} = this.props;
    const {naturalWidth, naturalHeight} = this.refs.image;

    modal.title = `${asset.assetId} ${naturalWidth} x ${naturalHeight} pixels`;
  }

  render() {
    const {asset} = this.props;
    const {assetChanged} = this.state;

    const dataUrl = asset.asset ? `data:${asset.contentType};base64,${asset.asset}` : '';

    return <div className="content">
      <div className="details">
        <div className="title">
          <span className="label">assetId:</span>
          <TextInput defaultValue={asset.assetId} onChange={this.assetId_onChangeHandler}/>
        </div>
        <div className="size">
          <span className="label">Size:</span>
          {asset.byteSize} bytes
        </div>
        <div className="content-type">
          <span className="label">Content-Type:</span>
          {asset.contentType}
          </div>
      </div>
      <div className="img">
        {dataUrl ? <img src={dataUrl} ref="image" /> : undefined}
      </div>
      {assetChanged ? <div className="save">
        <Button label="Save" className="green" onClick={this.save_onClickHandler} />
      </div> : undefined}
      </div>;
  }

  assetId_onChangeHandler(event) {
    this.setState({assetChanged: true, newAssetId: event.target.value});
  }

  save_onClickHandler() {
    const {asset, game} = this.props;
    const {newAssetId} = this.state;

    const assetAlreadyExists = game.assets.filter(a => a !== asset).find(a => a.assetId === newAssetId);

    if (!assetAlreadyExists) {
      asset.assetId = newAssetId;
      asset.dirty = true;

      this.props.assetIdChanged(asset);

      this.props.modal.remove();
    } else {
      Alert.show(`The asset '${newAssetId} already exists. Please choose a different name.'`, Alert.OK, {}, this.rootDomNode);
    }
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

    return <div className="asset" onClick={this.asset_onClickHandler.bind(this, asset)} key={asset.id}>
      {dataUrl ? <div className="img">
        <img src={dataUrl} ref={`img${asset.id}`} />
      </div> : undefined}
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
        <div className="total-size">{assets.length} Assets, {Math.round(totalSize / 1024)} kb Total</div>
        <Button label="Upload..."
                onClick={this.upload_onClickHandler}/>
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
    this.setState({showUpload: false});

    this.dispatch(APIController.ADD_ASSET, {
      gameId: this.props.game.id,
      assetId: this.state.assetId,
      groupId: '',
      description: '',
      type: '',
      file: this.refs.fileInput.files[0]
    }).then($lastPromiseResult => {
      this.props.game.assets = $lastPromiseResult.assets;
      this.props.game.initializeAssets().then(() => {
        this.forceUpdate();
      });
    });
  }

  asset_onClickHandler(asset) {
    const img = this.refs[`img${asset.id}`];
    const {game} = this.props;

    if (asset._modal) {
      return;
    }

    asset.edited = true;

    asset._modal = ModalModel.show({
      title: '',
      classes: 'asset-modal',
      renderer: AssetModalImage,
      rendererProps: {
        asset,
        game,
        assetIdChanged: this.assetIdChangedHandler
      },
      position: 'centered',
      draggable: true,
      width: Math.max(Math.min(img.naturalWidth + 50, window.innerWidth - 100), 250),
      height: Math.min(img.naturalHeight + 150, window.innerHeight - 100),
      singletonGroup: asset.id
    });

    asset._modal.addEventListener('remove', () => {
      delete asset._modal;
    });
  }

  assetIdChangedHandler() {
    this.props.game.dirty = true;

    this.props.game.initializeAssets().then(() => {
      this.forceUpdate();
    });
  }

  asset_deleteOnClickHandler(asset, event) {
    event.stopPropagation();

    Alert.show(`Are you sure you want to completely delete ${asset.assetId}?`, Alert.YES_NO, undefined, this.rootDomNode).then(result => {
      if (result.id === 'yes') {
        this.dispatch(APIController.DELETE_ASSET, {
          gameId: this.props.game.id,
          assetId: asset.id
        }).then($lastPromiseResult => {
          this.props.game.assets = $lastPromiseResult.assets;
          this.props.game.initializeAssets().then(() => {
            this.forceUpdate();
          });
        });
      }
    });
  }
}
