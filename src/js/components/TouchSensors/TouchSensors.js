import React from "react";
import { connect } from "react-redux";

import { gridCoordsToOffsetAndDimStyle} from "./../../utils/gridCoordsToStyle";
import { move, moveEnemies } from "./../../state/actions/actions";
import "./TouchSensors.scss";

class TouchSensors extends React.Component{
	constructor(){
		super();
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.processTouch = this.processTouch.bind(this);
	}
	componentDidMount(){
		window.addEventListener("touchstart", this.handleTouchStart, false);
	}
	componentWillUnmount(){
		window.removeEventListener("touchstart", this.handleTouchStart);
	}
	processTouch(target){
		switch (target.id){
			case "topSensor":
				this.props.dispatch(move([-1,0]));
				break;
			case "botSensor":
				this.props.dispatch(move([1,0]));
				break;
			case "rightSensor":
				this.props.dispatch(move([0,1]));
				break;
			case "leftSensor":
				this.props.dispatch(move([0,-1]));
				break;
		}
		this.props.dispatch(moveEnemies());
	}
	handleTouchStart(event){
		if (this.props.gameOver === 0){	// Game is not over
			for (let i = 0; i < event.targetTouches.length; i++){
				this.processTouch(event.targetTouches[i].target);
			}
		}
	}
	render(){
		const 	cameraRows = this.props.camera.numRows,
				cameraCols = this.props.camera.numCols;
		const height = Math.ceil(cameraRows / 2);
		const width = Math.ceil(cameraCols / 2);
		return (
				<div className="touchSensors">
					<div id="topSensor" className="touchSensor" style={gridCoordsToOffsetAndDimStyle(0, width / 2, height, width)} key="topSensor" />
					<div id="botSensor" className="touchSensor" style={gridCoordsToOffsetAndDimStyle(height, width / 2, height, width)} key="botSensor" />
					<div id="leftSensor" className="touchSensor" style={gridCoordsToOffsetAndDimStyle(height / 2, 0, height, width / 2)} key="leftSensor" />
					<div id="rightSensor" className="touchSensor" style={gridCoordsToOffsetAndDimStyle(height / 2, width * 2 - width / 2, height, width / 2)} key="rightSensor" />
				</div>
				);
	}
}

TouchSensors.propTypes = {
	camera: React.PropTypes.object,
	gameOver: React.PropTypes.number,
	dispatch: React.PropTypes.func
};

const mapStateToProps = (state) => {
	return {
		camera: state.viewReducer.camera,
		gameOver: state.rogueReducer.gameOver
	};
};


const connectedTouchSensors = connect(mapStateToProps)(TouchSensors);

export default connectedTouchSensors;
