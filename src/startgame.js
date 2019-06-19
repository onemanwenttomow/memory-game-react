import React from 'react';

export function StartGame(props) {
    return (
        <React.Fragment>
            <div className={props.gameStarted ? "hidden" : "options-container"}>
                <div className={props.gameStarted ? "hidden" : "options"}>
                    Players: {' '}
                    <span onClick={() => props.numberOfPlayers(1)} className={props.numPlayers === 1 ? "num-players num-players-selected" : "num-players"}>1</span>
                    <span onClick={() => props.numberOfPlayers(2)} className={props.numPlayers === 2 ? "num-players num-players-selected" : "num-players"}>2</span>
                </div>
                <div className={props.gameStarted ? "hidden" : "options"}>
                    Mode: {' '}
                    <span onClick={() => props.gameMode("normal")} className={props.gameModeSelected === "normal" ? "num-players num-players-selected" : "num-players"}>Normal</span>
                    <span onClick={() => props.gameMode("hard")} className={props.gameModeSelected === "hard" ? "num-players num-players-selected" : "num-players"}>Hard</span>
                    <span onClick={() => props.gameMode("ultra")} className={props.gameModeSelected === "ultra" ? "num-players num-players-selected" : "num-players"}>Ultra</span>
                </div>
            </div>

            <div className={props.gameStarted ? "hidden" : "pickpack-container"}>
                { props.choiceOfPacks.map(
                    (card, index) => (
                        <div className="pickpack" key={index} onClick={e => props.setupNewGame(index)}>{card}</div>
                    )
                )}
            </div>
        </React.Fragment>
    );
}
