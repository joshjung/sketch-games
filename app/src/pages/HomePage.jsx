import React from 'react';

import {RingaComponent, Markdown, I18NModel, List, Button} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import AppModel from '../models/AppModel';
import APIController from '../controllers/APIController';
import AppController from '../controllers/AppController';

import './HomePage.scss';

export default class HomePage extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.depend(
      dependency(I18NModel, 'language'),
      dependency(AppModel, ['games', 'user'])
    );
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentDispatchReady() {
    this.dispatch(APIController.GET_GAMES);
  }

  render() {
    let {games = [], i18NModel} = this.state;

    games = games.filter(game => game.published);

    return <div className="home">
      <List items={games.concat()}
            indexField="id"
            indexFunction={game => `${game.publishedTitle} ${game.publishedDescription} ${game.owner.name}`}
            labelField="title"
            onChange={this.list_onChangeHandler}
            itemRenderer={this.gameListItemRenderer}/>
    </div>;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  gameListItemRenderer(itemClickHandler, game) {
    const hs = this.getHighscores(game);

    return <div className="item-renderer game-item"
                onClick={itemClickHandler}
                key={game.id}>
      <div className="image">{game.image && <img src={game.image} className="game-image-medium" />}</div>
      <div className="title">{game.publishedTitle}</div>
      <div className="description">{game.publishedDescription}</div>
      {game.owner && <div className="author">Author: {game.owner.name}</div>}
      <div className="playCount">{game.playCount || 0} Plays</div>
      <div className="highcore">{hs.score && 'High score of ' + hs.score + ' (' + hs.name + ')'}</div>
    </div>;
  }

  getSortedHighscores(game) {
    const hs = game.highscores || [];

    return hs.sort((hs1, hs2) => {
      return hs1.score < hs2.score ? 1 : -1;
    });
  }

  getHighscores(game) {
    const hss = this.getSortedHighscores(game);

    return hss.length ? hss[0] : {};
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  list_onChangeHandler(game) {
    this.dispatch(AppController.PLAY_GAME, {
      id: game.id
    });
  }
}
