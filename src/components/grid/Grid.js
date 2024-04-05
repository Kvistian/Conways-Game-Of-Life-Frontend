import React, { Component } from "react"
import './Grid.css'
import Cell from './cell/Cell'
import debounce from 'lodash/debounce'

class Grid extends Component {
    constructor(props) {
        super(props)
        let defaultGridSize = 20
        this.state = {
            isRunning: false,
            gridSize: defaultGridSize,
            grid: this.generateGrid(defaultGridSize)
        }
        this.updateGridSize = this.updateGridSize.bind(this)
        this.debounceUpdateGridSize = debounce(this.updateGridSize, 100)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.isRunning) {
            if (this.gridIsEmpty()) {
                this.setState({
                    isRunning: false
                })
            } else {
                setTimeout(() => this.tick(), 500)
            }
        } else if (prevState.gridSize !== this.state.gridSize) {
            console.log('grid size:', this.state.gridSize, prevState.gridSize)
            this.setState({
                grid: this.generateGrid(this.state.gridSize)
            })
        }
    }

    render() {
        if (!this.state.grid) {
            return (
                <p>Loading</p>
            )
        }
        return (
            <div>
                <div id='grid'>
                    <ul>
                        {this.state.grid.map((column, colKey) => (
                            <li className='column' key={colKey}>
                                <ul>
                                    {column.map((alive, rowKey) => <Cell toggleCell={() => this.toggleCell(colKey, rowKey)} key={rowKey} alive={alive} />)}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
                <ul className='nav' id='grid-nav'>
                    <li>Grid size <input onChange={e => this.debounceUpdateGridSize(e.target.value)} disabled={this.state.isRunning} type="number" value={this.state.gridSize}/></li>
                    <li><button disabled={this.state.isRunning} onClick={() => this.generateRandomSeed()}>Random seed</button></li>
                </ul>
                <ul className='nav' id='engine-nav'>
                    <li><button onClick={() => this.toggleRunning()} disabled={!this.state.isRunning && this.gridIsEmpty()}>{this.state.isRunning ? 'Stop' : 'Start'}</button></li>
                    <li><button onClick={() => this.tick()} disabled={this.state.isRunning || this.gridIsEmpty()}>Next</button></li>
                    <li><button onClick={() => this.clearGrid()} disabled={this.state.isRunning || this.gridIsEmpty()}>Clear</button></li>
                </ul>
            </div>
        )
    }

    updateGridSize(gridSize) {
        console.log("Click update grid size")
        const newGridSize = parseInt(gridSize, 10)
        if (!isNaN(newGridSize) && newGridSize >= 3 && newGridSize <= 100) {
            this.setState({
                gridSize: newGridSize
            });
        }
    }

    gridIsEmpty() {
        for (let columnIndex in this.state.grid) {
            for (let rowIndex in this.state.grid[columnIndex]) {
                if (this.state.grid[columnIndex][rowIndex]) {
                    return false
                }
            }
        }
        return true
    }

    clearGrid() {
        let newGrid = []
        for (let columnIndex in this.state.grid) {
            newGrid[columnIndex] = []
            for (let rowIndex in this.state.grid[columnIndex]) {
                newGrid[columnIndex][rowIndex] = false
            }
        }
        this.setState({
            grid: newGrid
        })
    }

    generateRandomSeed() {
        fetch('http://localhost:8080/seed/' + this.state.gridSize)
        .then(response => response.json())
        .then(newGrid => {
            this.setState({
                grid: newGrid
            })
        }, error => console.log("error generating random seed: ", error))
    }

    tick() {
        fetch('http://localhost:8080/tick', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.grid)
        }).then(response => response.json())
        .then(newGrid => {
            this.setState({
                grid: newGrid
            })
        }, error => console.log("error during tick: ", error))
    }

    toggleRunning() {
        this.setState({
            isRunning: !this.state.isRunning
        })
    }

    toggleCell(colKey, rowKey) {
        if (!this.state.isRunning) {
            let newGrid = [...this.state.grid]
            newGrid[colKey][rowKey] = !this.state.grid[colKey][rowKey];
            this.setState({
                grid: newGrid
            })
        }
    }

    generateGrid(gridSize) {
        let grid = []
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                if (!grid[x]) {
                    grid[x] = []
                }
                grid[x][y] = false
            }
        }

        return grid;
    }
}

export default Grid
