import React, { Component } from 'react';
import { StartGame } from './startgame';
import { ScoreCard } from './scorecard';
import { Board } from './board';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shuffledCards: [],
            numberOfPlayers: 1,
            restartGameButton: false,
            gameOverButton: false,
            gameModeSelected: "normal",
            choiceOfPacks: [
                ["🐶", "🐱", "🦄", "🐮", "🐷", "🐔", "🐸", "🦊", "🐵", "🦁", "🐺", "🦓"],
                ["⚾", "⚽", "🏉", "🏈", "🎾", "🎳", "🏏", "🏑", "⛳",  "🥇", "🏄", "🎽"],
                ["🚅", "🚂", "🚌", "🚑", "🚒", "🚓", "🚕", "🚚", "🏎️", "🏍️", "🚲", "✈️"]
            ]
        };
        this.shuffleArray = this.shuffleArray.bind(this);
        this.checkForPair = this.checkForPair.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.setupNewGame = this.setupNewGame.bind(this);
        this.numberOfPlayers = this.numberOfPlayers.bind(this);
        this.changeTurns = this.changeTurns.bind(this);
        this.cardFound = this.cardFound.bind(this);
        this.noCardFound = this.noCardFound.bind(this);
        this.updateScore = this.updateScore.bind(this);
        this.restartGame = this.restartGame.bind(this);
        this.gameMode = this.gameMode.bind(this);
        this.randomShuffle = this.randomShuffle.bind(this);
    }
    setupNewGame(deckNumber) {
        this.setState({
            shuffledCards: [],
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
            turnsLeft: 25
        })
        var totalCards = this.state.choiceOfPacks[deckNumber].concat(this.state.choiceOfPacks[deckNumber].slice());
        this.setState({
            shuffledCards: this.shuffleArray(totalCards),
            // shuffledCards: totalCards,
            pickedPack: this.state.choiceOfPacks[deckNumber]
        });
        if (this.state.gameModeSelected === "ultra") {
            this.randomShuffle();
        }
    }
    randomShuffle() {
        setTimeout(() => {
            let totalCards = this.state.shuffledCards
            this.setState({ shuffledCards: this.shuffleArray(totalCards) });
            if (this.state.restartGameButton) {
                return;
            } else {
                this.randomShuffle()
            }
        }, 15000)
    }
    gameMode(mode) {
        this.setState({gameModeSelected: mode})
    }
    numberOfPlayers(num) {
        this.setState({numberOfPlayers: num});
    }
    changeTurns() {
        this.state.playerTurn === 1 ? this.setState({playerTurn: 2}) : this.setState({playerTurn: 1})
    }
    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    restartGame() {
        this.setState({
            gameStarted: false,
            restartGameButton: false,
            gameOverButton: false
        })
    }
    handleClick(card, index) {
        // don't allow click during animation
        if (this.state.isInMotion) { return; }
        // grab the currently selected card (if any) from state
        let currentSelectedCard = this.state.selectedCards;

        // don't allow the user to click the same card again.
        if (this.state.selectedCards.length === 1 && this.state.selectedCards[0].index === index) {
            return;
        }
        // add the current card and it's index an array.
        currentSelectedCard.push({card, index});

        // if there is only 1 card selected. Update state.
        if (currentSelectedCard.length === 1) {
            this.setState({
                selectedCards: currentSelectedCard,
                firstSelectedIndex: index
            });
        // if 2 cards are selected.
        } else if (currentSelectedCard.length === 2) {
            if (this.state.selectedCards[0].index === index) { return; }

            if (this.state.gameModeSelected === "hard")  {
                var turnsLeft = this.state.turnsLeft;
                turnsLeft--;
                if (turnsLeft === 0) {
                    this.setState({gameOverButton: true});
                }
            }
            this.setState({
                selectedCards: currentSelectedCard,
                secondSelectedIndex: index,
                isInMotion: true,
                turnsLeft: turnsLeft
            });
            // and then check for a pair.
            this.checkForPair() ? this.cardFound(card) : this.noCardFound();

        }
    }
    cardFound(card) {
        setTimeout(() => {
            this.updateScore(card)

            let newPairs = this.state.pairs;
            newPairs.push(this.state.selectedCards[0].index, this.state.selectedCards[1].index);
            let currentScore = this.state.currentScore;
            currentScore ++;
            this.setState({
                pairs: newPairs,
                isInMotion: false,
                currentScore: currentScore,
                selectedCards: [],
                firstSelectedIndex: null,
                secondSelectedIndex: null,
            })
            if (currentScore === this.state.shuffledCards.length / 2) {
                this.setState({ restartGameButton: true })
            }
        }, 900)
    }
    noCardFound() {
        setTimeout(() => {
            if (this.state.numberOfPlayers === 2) {
                this.changeTurns();
            }
            this.setState({
                selectedCards: [],
                firstSelectedIndex: null,
                secondSelectedIndex: null,
                isInMotion: false
            });
        }, 1000)
    }
    checkForPair() {
        if (this.state.selectedCards[0].card === this.state.selectedCards[1].card) {
            this.setState({ isInMotion: true });
            return true;
        }
    }
    updateScore(card) {
        let currentPlayerCards = this.state.cardsFound;
        currentPlayerCards[this.state.playerTurn -1].push(card);
        this.setState({ cardsFound: currentPlayerCards })
    }

    render() {
        console.log(this.state);
        return (
            <div className="App">

                <div className={this.state.restartGameButton ? "restart-button" : "hidden"} onClick={this.restartGame}>
                    Restart
                </div>

                <div className={this.state.gameOverButton ? "gameover-button" : "hidden"} onClick={this.restartGame}>
                    Game Over!
                </div>

                <StartGame
                    gameStarted={this.state.gameStarted}
                    numberOfPlayers={this.numberOfPlayers}
                    numPlayers={this.state.numberOfPlayers}
                    gameMode={this.gameMode}
                    gameModeSelected={this.state.gameModeSelected}
                    choiceOfPacks={this.state.choiceOfPacks}
                    setupNewGame={this.setupNewGame}
                />

                <div className={this.state.gameStarted ? "board-container" : " hidden"}>

                    <Board
                        shuffledCards={this.state.shuffledCards}
                        pairs={this.state.pairs}
                        firstSelectedIndex={this.state.firstSelectedIndex}
                        secondSelectedIndex={this.state.secondSelectedIndex}
                        handleClick={this.handleClick}
                    />

                    <ScoreCard
                        playerTwoTurn = {this.state.playerTurn === 2 ? "current-player-turn" : "none-player-turn"}
                        twoPlayers = {this.state.numberOfPlayers === 2 ? "score-counter" : "hidden"}
                        gameStarted={this.state.gameStarted}
                        playerTurn={this.state.playerTurn}
                        cardsFound={this.state.cardsFound}
                        pickedPack={this.state.pickedPack}
                        turnsLeft={this.state.turnsLeft}
                        gameModeSelected={this.state.gameModeSelected}
                    />

                </div>
            </div>
        );
    }
}

export default App;
