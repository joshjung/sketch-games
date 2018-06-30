import React from 'react';

import {RingaComponent, I18NModel, List, ScreenModel} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import GamePenModel from '../../models/GamePenModel';
import APIController from '../../controllers/APIController';
import GamePenController from '../../controllers/GamePenController';

import Loader from '../Loader';
import Video from '../Video';

import classnames from 'classnames';

import ASTEROIDS_MP4 from '../../../assets/videos/asteroids.mp4';
import EDITOR_MP4 from '../../../assets/videos/editor.mp4';
import PUBLISHING_MP4 from '../../../assets/videos/publishing.mp4';

import './HomePage.scss';

export default class HomePage extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.depend(
      dependency(I18NModel, 'language'),
      dependency(GamePenModel, ['games', 'user']),
      dependency(ScreenModel, 'curBreakpointIx')
    );
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentDispatchReady() {
    this.dispatch(APIController.GET_GAMES);
  }

  render() {
    let {games = [], curBreakpointIx} = this.state;

    games = games.filter(game => game.published);

    return <div className="home">
      {this.renderSplash()}
      <List items={games.concat()}
            indexField="id"
            indexFunction={game => `${game.publishedTitle} ${game.publishedDescription} ${game.owner.name}`}
            labelField="title"
            onChange={this.list_onChangeHandler}
            itemRenderer={this.gameListItemRenderer}/>
      <Loader show={!games.length} />
    </div>;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  renderSplash() {
    const {curBreakpointIx} = this.state;

    if (curBreakpointIx < 3) {
      return undefined;
    }

    return <div className="splash">
      <div className="card white">
        <div className="contents centered">
          <div className="content">
            At GamePen you can <span className="blue">build, play</span>, and <span className="blue">share</span> community <span className="blue">web games</span> on mobile or desktop.
          </div>
        </div>
      </div>
      <div className="card white">
        <Video src={ASTEROIDS_MP4} autoPlay muted loop />
        <div className="contents">
          <div className="heading">Kick Back</div>
          <div className="description">
            <ul>
              <li>Play games</li>
              <li>Record high scores</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="card fade">
        <Video src={EDITOR_MP4} autoPlay muted loop />
        <div className="contents">
          <div className="heading bubble-text">Be Inspired</div>
          <div className="description bubble-text">Follow easy tutorials and build a simple game in less than 1 hour</div>
        </div>
      </div>
      <div className="card fade">
        <Video src={PUBLISHING_MP4} autoPlay muted loop />
        <div className="contents">
          <div className="heading bubble-text">Share your Creation</div>
          <div className="description bubble-text">Share your game with your friends and the world</div>
        </div>
      </div>
    </div>;
  }

  gameListItemRenderer(itemClickHandler, game) {
    const {curBreakpointIx} = this.state;
    const cn = classnames('item-renderer', {
      'game-item': curBreakpointIx > 2,
      'game-item-mobile': curBreakpointIx <= 2
    });
    const hs = this.getHighscores(game);

    if (curBreakpointIx <= 2) {
      return <div className={cn}
                  onClick={itemClickHandler}
                  key={game.id}>
        <div className="image">{game.image && <img src={game.image} className="game-image-medium" />}</div>
        <div className="details">
          <div className="title">{game.publishedTitle}</div>
          <div className="description">{game.publishedDescription}</div>
          {game.owner && <div className="author">Author: {game.owner.name}</div>}
          <div className="playCount">{game.playCount || 0} Plays</div>
          <div className="highscore">{hs.score && <div>
            <span className="points">{hs.score}</span> highscore by {hs.name}</div>}
          </div>
        </div>
      </div>;
    } else {
      return <div className={cn}
                  onClick={itemClickHandler}
                  key={game.id}>
        <div className="image">{game.image && <img src={game.image} className="game-image-medium" />}</div>
        <div className="title">{game.publishedTitle}</div>
        <div className="description">{game.publishedDescription}</div>
        {game.owner && <div className="author">Author: {game.owner.name}</div>}
        <div className="playCount">{game.playCount || 0} Plays</div>
        <div className="highscore">{hs.score && <div>
          <span className="points">{hs.score}</span> highscore by {hs.name}</div>}
        </div>
      </div>;
    }

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
    this.dispatch(GamePenController.PLAY_GAME, {
      id: game.id
    });
  }
}
