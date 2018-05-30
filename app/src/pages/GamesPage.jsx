import React from 'react';

import {RingaComponent, I18NModel, List, Button, Alert, Markdown} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import AppModel from '../models/AppModel';
import APIController from '../controllers/APIController';
import AppController from '../controllers/AppController';

import history from '../global/history';

import './GamesPage.scss';

export default class GamesPage extends RingaComponent {
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
    const { games = [], i18NModel } = this.state;

    return <div className="games">
      <Markdown markdown={i18NModel.i18n('games.content')} />
      <List items={games}
            labelField="title"
            onChange={this.list_onChangeHandler}
            itemRenderer={this.gameListItemRenderer}/>
    </div>;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  gameListItemRenderer(itemClickHandler, game) {
    const {user} = this.state;

    return <div className="item-renderer game-item"
                onClick={itemClickHandler}
                key={game.id}>
      <div className="title">{game.title}</div>
      {game.owner && <div className="author">Author: {game.owner.name}</div>}
      <div className="actions">
        {(user && user.id === game.ownerUserId) || !game.ownerUserId ? <div>
          <Button label="Develop" onClick={this.list_developButtonClickHandler.bind(this, game)} />
          <Button label="Delete" onClick={this.list_deleteClickHandler.bind(this, game)} />
        </div> : undefined}
        {user && <Button label="Duplicate" onClick={this.duplicate_clickHandler.bind(this, game)} />}
        {!user && <div>Login for more actions</div>}
      </div>
      </div>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  list_onChangeHandler(game) {
    console.log(arguments);
    this.dispatch(AppController.PLAY_GAME, {
      id: game.id
    });
  }

  list_developButtonClickHandler(game, event) {
    event.stopPropagation();

    this.dispatch(AppController.EDIT_GAME, {
      id: game.id
    });
  }

  list_deleteClickHandler(game, event) {
    event.stopPropagation();

    Alert.show(`Are you sure you want to permanently delete ${game.title}`, Alert.YES_NO, {}, this.rootDomNode).then(result => {
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
