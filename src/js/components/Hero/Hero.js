import React from "react";
import { connect } from "react-redux";

import { gridCoordsToOffsetStyle } from "./../../utils/gridCoordsToStyle";
import { move, moveEnemies } from "./../../state/actions/actions";
import "./Hero.scss";

class Hero extends React.Component{
	constructor(){
		super();
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.moveHero = this.moveHero.bind(this);
	}
	componentDidMount(){
		window.addEventListener("keydown", this.handleKeyDown);
	}
	componentWillUnmount(){
		window.removeEventListener("keydown", this.handleKeyDown);
	}
	moveHero(key){
		switch (key){
			case "ArrowUp":
				this.props.dispatch(move([-1,0]));
				break;
			case "ArrowDown":
				this.props.dispatch(move([1,0]));
				break;
			case "ArrowRight":
				this.props.dispatch(move([0,1]));
				break;
			case "ArrowLeft":
				this.props.dispatch(move([0,-1]));
				break;
		}
		this.props.dispatch(moveEnemies());
	}
	handleKeyDown(e){
		if (this.props.gameOver === 0){	// Game is not over
			if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "ArrowLeft"){
				this.moveHero(e.key);
			}
		}
	}
	render(){
		return (
			<div className="hero" style={gridCoordsToOffsetStyle(this.props.row, this.props.col)} />
			);
	}
}

Hero.propTypes = {
	dungeon: React.PropTypes.array,
	row: React.PropTypes.number,
	col: React.PropTypes.number,
	gameOver: React.PropTypes.number,
	dispatch: React.PropTypes.func,
};

const mapStateToProps = (state) => {
	return {
		dungeon: state.rogueReducer.dungeon,
		row: state.rogueReducer.heroPosition.row,
		col: state.rogueReducer.heroPosition.col,
		gameOver: state.rogueReducer.gameOver
	};
};


const connectedHero = connect(mapStateToProps)(Hero);

export default connectedHero;
