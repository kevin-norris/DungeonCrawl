import React from "react";
import { connect } from "react-redux";

import Dungeon from "./../Dungeon/Dungeon";
import Hero from "./../Hero/Hero";
import { gridCoordsToOffsetStyle } from "./../../utils/gridCoordsToStyle";
import { DUNGEON_WIDTH, DUNGEON_HEIGHT } from "./../../utils/DungeonGenerator/DungeonConstants";
import { clamp } from "./../../utils/helperFunctions";
import { generateDungeon } from "./../../state/actions/actions";
import "./World.scss";

// This function is from https://github.com/stevenhauser/i-have-to-return-some-videotapes/blob/master/src/components/World/WorldContainer.js
function calcCoord(worldDim, camDim, playerCoord) {
  // Number of units that are offscreen for this x or y dimension.
  const unitsOutsideCamera = worldDim - camDim;
  // Ideal number of units around the player. This puts the player
  // in the center of the camera.
  const unitsAroundPlayer = camDim / 2;
  // The world is being translated via `top` and `left`, so we never
  // want it to be greater than 0 or else there'd be empty space shown
  // in the top or left corner.
  const maxCoord = 0;
  // The world gets translated in the opposite direction that the
  // player is moving, so the furthest it can go in the opposite
  // direction without showing beyond the world's bounds is the
  // number of units outside of the camera, but in the negative.
  const minCoord = -unitsOutsideCamera;
  // This is the ideal number of units to move the world; it tries
  // to center the player within the camera by offsetting how many
  // camera units are on either side of the player. Again, it's the
  // negative value since the world translates in the opposite direction
  // of the player.
  const coord = -(playerCoord - unitsAroundPlayer);
  // Finally, to ensure that we don't show any gaps between the world's
  // bounds and the camera, we `clamp` `coord` within those bounds.
  return clamp(coord, minCoord, maxCoord);
}

class World extends React.Component{
  componentDidMount(){
    this.props.dispatch(generateDungeon());
  }
	render(){
		const wStyle = gridCoordsToOffsetStyle(calcCoord(DUNGEON_HEIGHT, this.props.cameraRows, this.props.heroRow), calcCoord(DUNGEON_WIDTH, this.props.cameraCols, this.props.heroCol));
    return (
			<div className="world" style={wStyle}>
				<Dungeon />
				<Hero />
			</div>
			);
	}
}

World.propTypes = {
	cameraRows: React.PropTypes.number,
  cameraCols: React.PropTypes.number,
  heroRow: React.PropTypes.number,
  heroCol: React.PropTypes.number,
  dispatch: React.PropTypes.func
};



const mapStateToProps = (state) => {
	return {
    cameraRows: state.viewReducer.camera.numRows,
    cameraCols: state.viewReducer.camera.numCols,
    heroRow: state.rogueReducer.heroPosition.row,
    heroCol: state.rogueReducer.heroPosition.col
	};
};

const ConnectedWorld = connect(mapStateToProps)(World);

export default ConnectedWorld;
