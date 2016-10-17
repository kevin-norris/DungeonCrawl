import React from "react";
import { connect } from "react-redux";

import World from "./../World/World";
import Darkness from "./../Darkness/Darkness";
import TouchSensors from "./../TouchSensors/TouchSensors";
import { gridCoordsToDimStyle } from "./../../utils/gridCoordsToStyle";
import { getScreenSize, clamp } from "./../../utils/helperFunctions";
import * as Constants from "./../../utils/Constants";
import { updateCamSize } from "./../../state/actions/actions";
import "./Camera.scss";

class Camera extends React.Component{
	constructor(){
		super();
		// Creat throttled custome resize event
		// From: https://developer.mozilla.org/en-US/docs/Web/Events/resize
		var throttle = function(type, name, obj) {
			obj = obj || window;
			var running = false;
			var func = function() {
				if (running) { return; }
				running = true;
				requestAnimationFrame(function() {
					obj.dispatchEvent(new CustomEvent(name));
					running = false;
				});
			};
			obj.addEventListener(type, func);
		};

		throttle("resize", "optimizedResize");
		this.handleResize = this.handleResize.bind(this);
	}
	componentDidMount(){
		window.addEventListener("optimizedResize", this.handleResize);
		this.handleResize();
	}
	componentWillUnmount(){
		window.removeEventListener("optimizedResize", this.handleResize);
	}
	handleResize(){
		const { width, height } = getScreenSize();
		// Max number of columns and rows that could fit on the screen if there was nothing else
		// Clamped to >= 10 and <= dungeon size
		let numRows = clamp(Math.floor((height / Constants.PX_PER_ROW)), 10, Constants.CAM_ROWS);
		let numCols = clamp(Math.floor((width / Constants.PX_PER_COL)), 10, Constants.CAM_COLS);
		// Adjust row and col
		if (height < 1000){
			numRows = Math.floor(numRows * 0.65);	// take up 65% of screen height
		} else {
			numRows = Math.floor(numRows * 0.75);
		}
		numCols = Math.floor(numCols * 0.9);	// take up 90 % of screen width
		this.props.dispatch(updateCamSize({numRows: numRows, numCols: numCols}));
	}
	render(){
		const style = gridCoordsToDimStyle(this.props.camera.numRows, this.props.camera.numCols);
		return (
			<div className="camera" style={style}>
				<World />
				<Darkness />
				<TouchSensors />
			</div>
			);

	}
}

Camera.propTypes = {
	camera: React.PropTypes.object,
	dispatch: React.PropTypes.func
};

const mapStateToProps = (state) => {
	return {
		camera: state.viewReducer.camera,
	};
};


const connectedCamera = connect(mapStateToProps)(Camera);

export default connectedCamera;

