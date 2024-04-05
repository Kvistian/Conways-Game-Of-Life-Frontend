import React, { Component } from "react";
import './Cell.css';

class Cell extends Component {    
    render() {
        return (
            <li onClick={this.props.toggleCell} className={`cell ${this.props.alive ? 'alive' : ''}`}></li>
        )
    }
}

export default Cell;
