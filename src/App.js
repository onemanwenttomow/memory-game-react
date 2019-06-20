import React, { useState } from 'react';
import { StartGame } from './startgame';
import { ScoreCard } from './scorecard';
import { Board } from './board';
import './App.css';

function App() {
    const [state, setState] = useState({
        shuffledCards: [],
        numberOfPlayers: 1,
        restartGameButton: false,
        gameOverButton: false,
        pairs: [],
        gameModeSelected: "normal",
        choiceOfPacks: [
            ["🐶", "🐱", "🦄", "🐮", "🐷", "🐔", "🐸", "🦊", "🐵", "🦁", "🐺", "🦓"],
            ["⚾", "⚽", "🏉", "🏈", "🎾", "🎳", "🏏", "🏑", "⛳",  "🥇", "🏄", "🎽"],
            ["🚅", "🚂", "🚌", "🚑", "🚒", "🚓", "🚕", "🚚", "🏎️", "🏍️", "🚲", "✈️"]
        ]
    })

    function setupNewGame(deckNumber) {
        console.log("about to start game: ", deckNumber);
        var totalCards = state.choiceOfPacks[deckNumber].concat(state.choiceOfPacks[deckNumber].slice());
        setState({
            ...state,
            selectedCards: [],
            firstSelectedIndex: null,
            secondSelectedIndex: null,
            pairs: [],
            isInMotion: false,
            currentScore: 0,
            gameStarted: true,
            cardsFound: [
                [], []
            ],
            playerTurn: 1,
            turnsLeft: 25,
            // shuffledCards: shuffleArray(totalCards),
            shuffledCards: totalCards,
            pickedPack: state.choiceOfPacks[deckNumber]
        })

        if (state.gameModeSelected === "ultra") {
            randomShuffle();
        }
    }
    function randomShuffle() {
        setTimeout(() => {
            let totalCards = state.shuffledCards
            setState({
                ...state,
                shuffledCards: shuffleArray(totalCards)
            });
            if (state.restartGameButton) {
                return;
            } else {
                randomShuffle()
            }
        }, 15000)
    }
    function gameMode(mode) {
        setState({...state, gameModeSelected: mode});
    }
    function numberOfPlayers(num) {
        setState({...state, numberOfPlayers: num});
    }
    function changeTurns() {
        state.playerTurn === 1 ? setState({...state, playerTurn: 2}) : setState({...state, playerTurn: 1})
    }
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    function restartGame() {
        setState({
            ...state,
            gameStarted: false,
            restartGameButton: false,
            gameOverButton: false
        })
    }
    function handleClick(card, index) {
        // don't allow click during animation
        if (state.isInMotion) { return; }
        // grab the currently selected card (if any) from state
        let currentSelectedCard = state.selectedCards;

        // don't allow the user to click the same card again.
        if (state.selectedCards.length === 1 && state.selectedCards[0].index === index) {
            return;
        }
        // add the current card and it's index an array.
        currentSelectedCard.push({card, index});

        // if there is only 1 card selected. Update state.
        if (currentSelectedCard.length === 1) {
            setState({
                ...state,
                selectedCards: currentSelectedCard,
                firstSelectedIndex: index
            });
        // if 2 cards are selected.
        } else if (currentSelectedCard.length === 2) {
            if (state.selectedCards[0].index === index) { return; }

            if (state.gameModeSelected === "hard")  {
                var turnsLeft = state.turnsLeft;
                turnsLeft--;
                if (turnsLeft === 0) {
                    setState({...state, gameOverButton: true});
                }
            }
            setState({
                ...state,
                selectedCards: currentSelectedCard,
                secondSelectedIndex: index,
                isInMotion: true,
                turnsLeft: turnsLeft
            });
            // and then check for a pair.
            checkForPair() ? cardFound(card) : noCardFound();

        }
    }
    function cardFound(card) {
        setTimeout(() => {
            updateScore(card)

            let newPairs = state.pairs;
            newPairs.push(state.selectedCards[0].index, state.selectedCards[1].index);
            let currentScore = state.currentScore;
            currentScore ++;
            setState({
                ...state,
                pairs: newPairs,
                isInMotion: false,
                currentScore: currentScore,
                selectedCards: [],
                firstSelectedIndex: null,
                secondSelectedIndex: null,
            })
            if (currentScore === state.shuffledCards.length / 2) {
                setState({ ...state, restartGameButton: true })
            }
        }, 900)
    }
    function noCardFound() {
        setTimeout(() => {
            if (state.numberOfPlayers === 2) {
                changeTurns();
            }
            setState({
                ...state,
                selectedCards: [],
                firstSelectedIndex: null,
                secondSelectedIndex: null,
                isInMotion: false
            });
        }, 1000)
    }
    function checkForPair() {
        if (state.selectedCards[0].card === state.selectedCards[1].card) {
            return true;
        }
    }
    function updateScore(card) {
        let currentPlayerCards = state.cardsFound;
        currentPlayerCards[state.playerTurn -1].push(card);
        setState({ ...state, cardsFound: currentPlayerCards })
    }


    console.log(state);
    return (
        <div className="App">

            <div className={state.restartGameButton ? "restart-button" : "hidden"} onClick={restartGame}>
                Restart
            </div>

            <div className={state.gameOverButton ? "gameover-button" : "hidden"} onClick={restartGame}>
                Game Over!
            </div>

            <StartGame
                gameStarted={state.gameStarted}
                numberOfPlayers={numberOfPlayers}
                numPlayers={state.numberOfPlayers}
                gameMode={gameMode}
                gameModeSelected={state.gameModeSelected}
                choiceOfPacks={state.choiceOfPacks}
                setupNewGame={setupNewGame}
            />

            <div className={state.gameStarted ? "board-container" : " hidden"}>

                <Board
                    shuffledCards={state.shuffledCards}
                    pairs={state.pairs}
                    firstSelectedIndex={state.firstSelectedIndex}
                    secondSelectedIndex={state.secondSelectedIndex}
                    handleClick={handleClick}
                />

                <ScoreCard
                    playerTwoTurn = {state.playerTurn === 2 ? "current-player-turn" : "none-player-turn"}
                    twoPlayers = {state.numberOfPlayers === 2 ? "score-counter" : "hidden"}
                    gameStarted={state.gameStarted}
                    playerTurn={state.playerTurn}
                    cardsFound={state.cardsFound}
                    pickedPack={state.pickedPack}
                    turnsLeft={state.turnsLeft}
                    gameModeSelected={state.gameModeSelected}
                />

            </div>
        </div>
    );

}

export default App;
