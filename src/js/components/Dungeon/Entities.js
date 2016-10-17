import React from "react";
import { connect } from "react-redux";

import Tile from "./Tile/Tile";

class Entities extends React.Component{
	render(){
		return (
			<div className="entities">
				{this.props.entities.map((obj) => (
					<Tile tileType={obj.type} yPos={obj.position[0]} xPos={obj.position[1]} key={obj.type + ":row:" + obj.position[0] + "col:" + obj.position[1]} />
				))}
			</div>
			);
	}
}

Entities.propTypes = {
	entities: React.PropTypes.array,
};

const mapStateToProps = (state) => {
	return {
		entities: state.rogueReducer.entities,
	};
};

const ConnectedEntities = connect(mapStateToProps)(Entities);

export default ConnectedEntities;
