import React from 'react';

import {RingaComponent, I18NModel, List, Button, Alert} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import GamePenModel from '../../models/GamePenModel';
import APIController from '../../controllers/APIController';
import GamePenController from '../../controllers/GamePenController';

import history from '../../util/history';

import './GamesPage.scss';
import Loader from "../Loader";

export default class GamesPage extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.state = {
      filter: 'all',
      loading: false
    };

    this.depend(
      dependency(I18NModel, 'language'),
      dependency(GamePenModel, ['games', 'user'])
    );
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentDispatchReady() {
    this.setState({
      loading: true
    });

    this.dispatch(APIController.GET_GAMES).then(() => {
      this.setState({
        loading: false
      });
    });
  }

  componentWillUpdate(nextProps) {
    if (nextProps.match.params.filter && nextProps.match.params.filter !== this.state.filter) {
      this.setState({filter: nextProps.match.params.filter});
    }
  }

  render() {
    let { filter, user, loading } = this.state;

    if (this.props.match.params.filter) {
      filter = this.props.match.params.filter;
    }

    const renderedGames = this.getFilteredGames();

    let content;

    if (!loading) {
      content = renderedGames.length ? <List items={renderedGames}
                                             labelField="title"
                                             onChange={this.list_onChangeHandler}
                                             itemRenderer={this.gameListItemRenderer}/>
        : <div className="filter-empty">There are no games available for this filter.</div>;
    }

    return <div className="games">
      <div className="header">
        <h1>Games</h1>
        <div className="actions">
          <Button label="All"
                  selected={filter === 'all'}
                  onClick={() => this.setFilter('all')} />
          <Button label="Published"
                  selected={filter === 'published'}
                  onClick={() => this.setFilter('published')} />
          <Button label="Development"
                  selected={filter === 'development'}
                  onClick={() => this.setFilter('development')} />
          {user && <Button label="Mine"
                  selected={filter === 'mine'}
                  onClick={() => this.setFilter('mine')} />}
          {user && <Button label="My Published"
                  selected={filter === 'mine-published'}
                  onClick={() => this.setFilter('mine-published')} />}
          {user && <Button label="My Development"
                  selected={filter === 'mine-development'}
                  onClick={() => this.setFilter('mine-development')} />}
        </div>
      </div>
      {content}
      <Loader show={loading} />
    </div>;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  setFilter(filter) {
    history.push(`/games/${filter}`);

    this.setState({
      filter
    });
  }

  getFilteredGames() {
    const { games = [], filter, user } = this.state;

    switch (filter) {
      case 'all':
        return games;
      case 'published':
        return games.filter(game => !!game.published);
      case 'development':
        return games.filter(game => !game.published);
      case 'mine':
        return games.filter(game => user.id === game.ownerUserId);
      case 'mine-published':
        return games.filter(game => user.id === game.ownerUserId && game.published);
      case 'mine-development':
        return games.filter(game => user.id === game.ownerUserId && !game.published);
    }
  }

  gameListItemRenderer(itemClickHandler, game) {
    const {user} = this.state;

    return <div className="item-renderer game-item"
                onClick={itemClickHandler}
                key={game.id}>
      <div className="image">{game.image && <img className="game-image-tiny" src={game.image} /> }</div>
      <div className="title">{game.title}</div>
      {game.published ? <span className="published-card">Published</span> : <span className="unpublished-card">UnPublished</span>}
      {game.owner && <div className="author">Author: {game.owner.name}</div>}
      <div className="actions">
        <Button onClick={this.list_playClickHandler.bind(this, game)} classes="highlight"><i className="fa fa-play" /></Button>
        <Button onClick={this.list_developButtonClickHandler.bind(this, game)}><i className="fa fa-edit" /></Button>
        {user && <Button label="Duplicate" onClick={this.duplicate_clickHandler.bind(this, game)}><i className="fa fa-copy" /></Button>}
        {(user && user.id === game.ownerUserId) ? <Button onClick={this.list_deleteClickHandler.bind(this, game)} classes="warning"><i className="fa fa-trash" /></Button> : undefined}
        {!user && <div>Login for more actions</div>}
      </div>
      </div>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  list_onChangeHandler(game) {
    this.dispatch(GamePenController.PLAY_GAME, {
      id: game.id
    });
  }

  list_playClickHandler(game) {
    this.dispatch(GamePenController.PLAY_GAME, {
      id: game.id
    });
  }

  list_developButtonClickHandler(game, event) {
    event.stopPropagation();

    this.dispatch(GamePenController.EDIT_GAME, {
      id: game.id
    });
  }

  list_deleteClickHandler(game, event) {
    event.stopPropagation();

    Alert.show(`Are you sure you want to permanently delete ${game.title}?`, Alert.YES_NO, {}, this.rootDomNode).then(result => {
      if (result.id === 'yes') {
        this.dispatch(APIController.DELETE_GAME, {
          id: game.id
        }).then(() => {
          this.dispatch(APIController.GET_GAMES);
        });
      }
    });
  }

  duplicate_clickHandler(game, event) {
    event.stopPropagation();

    Alert.show(`Do you want to completely copy ${game.title} into your account?`, Alert.YES_NO, {}, this.rootDomNode).then(result => {
      if (result.id === 'yes') {
        this.dispatch(APIController.CLONE_GAME, {
          id: game.id
        }).then($lastPromiseResult => {
          if ($lastPromiseResult._id) {
            history.push(`/games/playground/${$lastPromiseResult._id}`);
          } else {
            console.error('An error occurred', $lastPromiseResult);
          }
        });
      }
    })
  }
}
