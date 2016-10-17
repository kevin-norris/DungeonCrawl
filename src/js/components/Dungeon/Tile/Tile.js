import React from "react";

import { gridCoordsToOffsetStyle } from "./../../../utils/gridCoordsToStyle";
import "./Tile.scss";


export default class Tile extends React.Component{
	render(){
		const classes = ["tile"];
		switch (this.props.tileType){
			case 0:
				break;
			case 1:
			case 2:
				classes.push("floor");
				break;
			case 3:
				classes.push("hp");
				break;
			case 4:
				classes.push("weapon");
				break;
			case 5:
				classes.push("portol");
				break;
			case 6:
				classes.push("enemy");
				break;
			case 7:
				classes.push("boss");
				break;
			default:
				break;
		}
		return (
			<span className={classes.join(" ")} style={gridCoordsToOffsetStyle(this.props.yPos, this.props.xPos)} />
			);
	}
}

Tile.propTypes = {
	tileType: React.PropTypes.number,
	yPos: React.PropTypes.number,
	xPos: React.PropTypes.number,
};
