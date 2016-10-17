import React from "react";
import { connect } from "react-redux";

import { DUNGEON_WIDTH, DUNGEON_HEIGHT } from "./../../utils/DungeonGenerator/DungeonConstants";
import { gridCoordsToOffsetAndDimStyle} from "./../../utils/gridCoordsToStyle";
import "./Darkness.scss";

// The radius that the player can see when darkness is on
const range = 7;
const visibleSpace = range * 2;

/*
	This component creates 4 divs around the hero's position
	blocking the camera such that only tiles within range are visible
*/
class Darkness extends React.Component{
	render(){
		// Only render if the hero is instantiated, else can lead to some bugs
		if (this.props.dark && this.props.heroPosition.row !== undefined){
			const 	cameraRows = this.props.camera.numRows,
					cameraCols = this.props.camera.numCols;
			const 	heroRow = this.props.heroPosition.row,
					heroCol = this.props.heroPosition.col;
			const height = (cameraRows - visibleSpace) / 2;
			const width = (cameraCols - visibleSpace) / 2;

			// The hight of the top div
			let topHeight = height;
			// The top position of the bottom div
			let botTop = height + visibleSpace;
			if (heroRow < cameraRows / 2){
				topHeight = topHeight - (cameraRows / 2 - heroRow);
				botTop = botTop - (cameraRows / 2 - heroRow);
			} else if (heroRow > DUNGEON_HEIGHT - cameraRows / 2){
				topHeight = topHeight + (heroRow - (DUNGEON_HEIGHT - cameraRows / 2));
				botTop = botTop + (heroRow - (DUNGEON_HEIGHT - cameraRows / 2));
			}

			// The width of the left div
			let leftWidth = width;
			// The left position of the right div
			let rightLeft = width + visibleSpace;
			if (heroCol < cameraCols / 2){
				leftWidth = leftWidth - (cameraCols / 2 - heroCol);
				rightLeft = rightLeft - (cameraCols / 2 - heroCol);
			} else if (heroCol > DUNGEON_WIDTH - cameraCols / 2){
				leftWidth = leftWidth + (heroCol - (DUNGEON_WIDTH - cameraCols / 2));
				rightLeft = rightLeft + (heroCol - (DUNGEON_WIDTH - cameraCols / 2));
			}
			return (
				<div className="darknessWrapper">
					<div className="darkness" style={gridCoordsToOffsetAndDimStyle(0, 0, topHeight, cameraCols)} key="topDarkness" />
					<div className="darkness" style={gridCoordsToOffsetAndDimStyle(botTop, 0, cameraRows, cameraCols)} key="botDarkness" />
					<div className="darkness" style={gridCoordsToOffsetAndDimStyle(0, 0, cameraRows, leftWidth)} key="leftDarkness" />
					<div className="darkness" style={gridCoordsToOffsetAndDimStyle(0, rightLeft, cameraRows, cameraCols)} key="rightDarkness" />
				</div>
				);
		} else {
			return (<div className="darknessWrapper" />);
		}
	}
}

Darkness.propTypes = {
	camera: React.PropTypes.object,
	dark: React.PropTypes.bool,
	heroPosition: React.PropTypes.object,
	dispatch: React.PropTypes.func
};

const mapStateToProps = (state) => {
	return {
		camera: state.viewReducer.camera,
		dark: state.viewReducer.dark,
		heroPosition: state.rogueReducer.heroPosition
	};
};


const connectedDarkness = connect(mapStateToProps)(Darkness);

export default connectedDarkness;
