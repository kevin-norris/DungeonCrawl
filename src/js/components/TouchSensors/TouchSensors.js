import React from "react";
import { connect } from "react-redux";

import { gridCoordsToOffsetAndDimStyle} from "./../../utils/gridCoordsToStyle";
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
		console.log("touched: ", target, " target ID: ", target.id);
	}
	handleTouchStart(event){
		for (let i = 0; i < event.targetTouches.length; i++){
			this.processTouch(event.targetTouches[i].target);
		}
	}
	render(){
		const 	cameraRows = this.props.camera.numRows,
				cameraCols = this.props.camera.numCols;
		const height = Math.floor(cameraRows / 3);
		const width = Math.floor(cameraCols / 3);
		return (
				<div className="touchSensors">
					<div id="topSensor" className="touchSensor" style={gridCoordsToOffsetAndDimStyle(0, width, height, width)} key="topSensor" />
					<div id="botSensor" className="touchSensor" style={gridCoordsToOffsetAndDimStyle(height * 2, width, height, width)} key="botSensor" />
					<div id="leftSensor" className="touchSensor" style={gridCoordsToOffsetAndDimStyle(height, 0, height, width)} key="leftSensor" />
					<div id="rightSensor" className="touchSensor" style={gridCoordsToOffsetAndDimStyle(height, width * 2, height, width)} key="rightSensor" />
				</div>
				);
	}
}

TouchSensors.propTypes = {
	camera: React.PropTypes.object,
	dispatch: React.PropTypes.func
};

const mapStateToProps = (state) => {
	return {
		camera: state.viewReducer.camera,
	};
};


const connectedTouchSensors = connect(mapStateToProps)(TouchSensors);

export default connectedTouchSensors;
