import React from "react";
import { connect } from "react-redux";

import Row from "./Row/Row";
import Entities from "./Entities";
import Enemies from "./Enemies";
import "./Dungeon.scss";

class Dungeon extends React.Component{

	render(){
		return (
				<div className="dungeonWrapper">
					{/*Render dungeon*/}
					{this.props.dungeon.map((row, index) => (
						<Row tiles={row} yPos={index} key={"row:" + index} />
						))}
					{/*Render entities in seperate components so when enteties change Dungeon render is not called*/}
					<Entities />
					<Enemies />
				</div>

			);
	}
}

Dungeon.propTypes = {
	dungeon: React.PropTypes.array,
};



const mapStateToProps = (state) => {
	return {
		dungeon: state.rogueReducer.dungeon,
	};
};

const ConnectedDungeon = connect(mapStateToProps)(Dungeon);

export default ConnectedDungeon;
