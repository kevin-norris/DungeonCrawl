import React from "react";
import ReactDom from "react-dom";
import { Provider } from "react-redux";

import Game from "./components/Game/Game";
import createStore from "./state/createStore";
import "./app.scss";

class App extends React.Component{
	render(){
		return (
			<Provider store={createStore()}>
				<Game />
			</Provider>
			);
	}
}

ReactDom.render(<App />, document.getElementById("app"));
