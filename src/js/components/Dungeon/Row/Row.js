import React from "react";

import "./Row.scss";
import Tile from "./../Tile/Tile";

export default class Row extends React.Component{
	render(){
		return (
			<div className={"row"}>
				{this.props.tiles.map((tileType, index) => (
					<Tile tileType={tileType} yPos={this.props.yPos} xPos={index} key={"y:" + this.props.yPos + ",x:" + index} />
				))}
			</div>
			);
	}
}

Row.propTypes = {
	tiles: React.PropTypes.array,
	yPos: React.PropTypes.number,
};

