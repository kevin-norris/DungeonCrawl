import React from "react";
import { connect } from "react-redux";

import "./HUD.scss";

class HUD extends React.Component{
	render(){
		return (
			<div className={"HUD" + (this.props.dark ? " dark" : "")}>
				<ul className={this.props.dark ? "dark" : ""}>
					<li>Health: {this.props.hero.hp}</li>
					<li>Weapon: {this.props.heroWeapon.name}</li>
					<li>Attack: {this.props.hero.damage * this.props.heroWeapon.multiplier}</li>
					<li>Level: {this.props.hero.level}</li>
					<li>Next Level: {this.props.hero.nextLevelXP} XP</li>
					<li>Dungeon: {this.props.dungeon}</li>
				</ul>
			</div>
			);
	}
}

HUD.propTypes = {
	hero: React.PropTypes.object,
	heroWeapon: React.PropTypes.object,
	dungeon: React.PropTypes.number,
	dark: React.PropTypes.bool,
	dispatch: React.PropTypes.func
};

const mapStateToProps = (state) => {
	return {
		hero: state.rogueReducer.hero,
		heroWeapon: state.rogueReducer.heroWeapon,
		dungeon: state.rogueReducer.level,
		dark: state.viewReducer.dark
	};
};

const ConnectedHUD = connect(mapStateToProps)(HUD);

export default ConnectedHUD;
