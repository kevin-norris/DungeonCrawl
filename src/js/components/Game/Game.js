import React from "react";
import { connect } from "react-redux";

import HUD from "./../HUD/HUD";
import Camera from "./../Camera/Camera";
import GameOver from "./../GameOver/GameOver";
import { toggleDarkness } from "./../../state/actions/actions";
import "./Game.scss";

class Game extends React.Component{
	constructor(){
		super();
		this.toggleDarkness = this.toggleDarkness.bind(this);
	}
	toggleDarkness(){
		this.props.dispatch(toggleDarkness());
	}
	render(){
		const darkClass = this.props.dark ? " dark" : "";
		return (
			<div className={"game" + darkClass}>
				<h1 className={"mainTitle" + darkClass}>Dungeon Crawl</h1>
				<p className={"helpTxt" + darkClass}>Kill The Boss In Dungeon 4</p>
				<HUD />
				<Camera />
				<p className={"helpTxt" + darkClass}>Use the arrow keys to move, on mobile tap the sides of the game screen.</p>
				<button className={"lightsButton" + darkClass} onClick={this.toggleDarkness}>{this.props.dark ? "Turn On The Lights" : "Turn Off The Lights"}</button>
				<GameOver />
			</div>
			);
	}
}

Game.propTypes = {
	dark: React.PropTypes.bool,
	dispatch: React.PropTypes.func,
};

const mapStateToProps = (state) => {
	return {
		dark: state.viewReducer.dark,
	};
};

const ConnectedGame = connect(mapStateToProps)(Game);

export default ConnectedGame;
