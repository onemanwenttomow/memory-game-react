import React from 'react';

export function ScoreCard(props) {
    return (
        <div className={props.gameStarted ? "score-container" : "hidden"}>
            <div className={props.playerTurn === 1 ? "score-counter current-player-turn"  : "score-counter none-player-turn"}>
                { props.cardsFound && props.pickedPack.map(
                    (card, index) => (
                        <div className={props.cardsFound[0].includes(card) ? "" : "greyed"} key={index} >{card}</div>
                    )
                )}
            </div>

            <div className={props.gameModeSelected === "hard" ? "score-counter current-player-turn turns-left" : "hidden"}>
                {props.turnsLeft}
            </div>

            <div className={`${props.playerTwoTurn} ${props.twoPlayers}`}>
                { props.cardsFound && props.pickedPack.map(
                    (card, index) => (
                        <div className={props.cardsFound[1].includes(card) ? "" : "greyed"} key={index} >{card}</div>
                    )
                )}
            </div>
        </div>
    );
}
