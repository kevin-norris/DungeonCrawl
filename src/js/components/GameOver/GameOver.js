import React from "react";
import { connect } from "react-redux";

import { generateDungeon } from "./../../state/actions/actions";
import "./GameOver.scss";

class GameOver extends React.Component{
	constructor(){
		super();
		this.resetGame = this.resetGame.bind(this);
	}
	resetGame(){
		this.props.dispatch(generateDungeon());
	}
	render(){
		const title = this.props.gameOver === -1 ? "You Died" : "You Won!";
		let alterClass = " won";
		if(this.props.gameOver === -1)
			alterClass = " dead";
		let stats = [];
		if (this.props.gameOver === 1){
			alterClass = " won";
			stats.push(<h3 key="stepsHeading">Steps taken: {this.props.heroStats.stepCount}</h3>);
			if (this.props.heroStats.stepCount > 1500){
				stats.push(<h4 key="stepsTitle">"Explorer"</h4>);
			} else if (this.props.heroStats.stepCount < 900){
				stats.push(<h4 key="stepsTitle">"Speed Runner"</h4>);
			}
			stats.push(<h3 key="killsHeading">Enemies slayen: {this.props.heroStats.killCount}</h3>);
			if (this.props.heroStats.killCount > 24){
				stats.push(<h4 key="killsTitle">"Slayer"</h4>);
			} else if (this.props.heroStats.killCount <= 16){
				stats.push(<h4 key="killsTitle">"Pacifist"</h4>);
			}
			stats.push(<h3 key="damageHeading">Damage taken: {this.props.heroStats.damageTaken}</h3>);
			if (this.props.heroStats.damageTaken > 2500){
				stats.push(<h4 key="damageTitle">"Bloody Mess"</h4>);
			} else if (this.props.heroStats.damageTaken < 1850){
				stats.push(<h4 key="damageTitle">"Can't Touch This"</h4>);
			}
			stats.push(<h3 key="hpHeading">Health increased: {this.props.heroStats.hpIncrease}</h3>);
			if (this.props.heroStats.hpIncrease > 2100){
				stats.push(<h4 key="healthTitle">"Hulk"</h4>);
			} else if (this.props.heroStats.hpIncrease < 1500){
				stats.push(<h4 key="healthTitle">"Wirey"</h4>);
			}
			stats.push(<h4 key="health"></h4>);
		}
		return (
				<div className={"gameOver" + (this.props.gameOver !== 0 ? " show" : "") + alterClass}>
					<h1>{title}</h1>
					<div className="stats">
						{stats}
					</div>
					<button className={"playBtn" + alterClass} onClick={this.resetGame}>Play Again</button>
				</div>

			);
	}
}

GameOver.propTypes = {
	gameOver: React.PropTypes.number,
	heroStats: React.PropTypes.object,
	dispatch: React.PropTypes.func
};



const mapStateToProps = (state) => {
	return {
		gameOver: state.rogueReducer.gameOver,
		heroStats: state.rogueReducer.heroStats,
	};
};

const ConnectedGameOver = connect(mapStateToProps)(GameOver);

export default ConnectedGameOver;
