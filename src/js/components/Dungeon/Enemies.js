import React from "react";
import { connect } from "react-redux";

import Tile from "./Tile/Tile";

class Enemies extends React.Component{
	render(){
		return (
			<div className="enemies">
				{this.props.enemyPositions.map((enemyPos, index) => (
					<Tile tileType={this.props.enemies[index].type} yPos={enemyPos[0]} xPos={enemyPos[1]} key={this.props.enemies[index].type + ":row" + enemyPos[0] + "col:" + enemyPos[1]} />
				))}
			</div>
			);
	}
}

Enemies.propTypes = {
	enemyPositions: React.PropTypes.array,
	enemies: React.PropTypes.array
};

const mapStateToProps = (state) => {
	return {
		enemyPositions: state.rogueReducer.enemyPositions,
		enemies: state.rogueReducer.enemies
	};
};

const ConnectedEnemies = connect(mapStateToProps)(Enemies);

export default ConnectedEnemies;
