import React, { Component } from 'react';
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
            // shuffledCards: this.shuffleArray(totalCards),
            shuffledCards: totalCards,
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
        if (mode === "normal") {
            this.setState({gameModeSelected: "normal"})
        } else if (mode === "hard") {
            this.setState({gameModeSelected: "hard"})
        } else {
            this.setState({gameModeSelected: "ultra"})
        }
    }
    numberOfPlayers(num) {
        num === 1 ? this.setState({numberOfPlayers: 1}) : this.setState({numberOfPlayers: 2})
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
        console.log("restart!");
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
        if (this.state.selectedCards.length === 1) {
            if (this.state.selectedCards[0].index === index) { return; }
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
            if (this.checkForPair()) {
                setTimeout(() => {
                    this.updateScore(card)
                    // let newShuffledCards = this.state.shuffledCards;
                    // let leftOverCards = newShuffledCards.map(function(item) {
                    //     if (item === card) {
                    //         return " ";
                    //       } else {
                    //         return item;
                    //       }
                    // } )
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
            } else {
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
        }
    }
    checkForPair() {
        if (this.state.selectedCards[0].card === this.state.selectedCards[1].card) {
            this.setState({ isInMotion: true });
            return true;
        } else {
            return false;
        }
    }
    updateScore(card) {
        let currentPlayerCards = this.state.cardsFound;
        currentPlayerCards[this.state.playerTurn -1].push(card);
        this.setState({ cardsFound: currentPlayerCards })
    }

    render() {
        console.log(this.state);
        let playerTwoTurn = this.state.playerTurn === 2 ? "current-player-turn" : "none-player-turn";
        let twoPlayers = this.state.numberOfPlayers === 2 ? "score-counter" : "hidden"
        return (
            <div className="App">

                <div className={this.state.restartGameButton ? "restart-button" : "hidden"} onClick={this.restartGame}>
                    Restart
                </div>

                <div className={this.state.gameOverButton ? "gameover-button" : "hidden"} onClick={this.restartGame}>
                    Game Over!
                </div>

                <div className={this.state.gameStarted ? "hidden" : "options-container"}>
                    <div className={this.state.gameStarted ? "hidden" : "options"}>
                        Players: {' '}
                        <span onClick={() => this.numberOfPlayers(1)} className={this.state.numberOfPlayers === 1 ? "num-players num-players-selected" : "num-players"}>1</span>
                        <span onClick={() => this.numberOfPlayers(2)} className={this.state.numberOfPlayers === 2 ? "num-players num-players-selected" : "num-players"}>2</span>
                    </div>
                    <div className={this.state.gameStarted ? "hidden" : "options"}>
                        Mode: {' '}
                        <span onClick={() => this.gameMode("normal")} className={this.state.gameModeSelected === "normal" ? "num-players num-players-selected" : "num-players"}>Normal</span>
                        <span onClick={() => this.gameMode("hard")} className={this.state.gameModeSelected === "hard" ? "num-players num-players-selected" : "num-players"}>Hard</span>
                        <span onClick={() => this.gameMode("ultra")} className={this.state.gameModeSelected === "ultra" ? "num-players num-players-selected" : "num-players"}>Ultra</span>
                    </div>
                </div>

                <div className={this.state.gameStarted ? "hidden" : "pickpack-container"}>
                    { this.state.choiceOfPacks.map(
                        (card, index) => (
                            <div className="pickpack" key={index} onClick={e => this.setupNewGame(index)}>{card}</div>
                        )
                    )}
                </div>

                <div className={this.state.gameStarted ? "board-container" : " hidden"}>
                    <div className="board">
                        { this.state.shuffledCards.map(
                            (card, index) => (
                                <div className={this.state.pairs.includes(index) ? "flip-card pair" : "flip-card"} key={index} onClick={e => this.handleClick(card, index)}>
                                    <div className={
                                        this.state.firstSelectedIndex === index ||
                                        this.state.secondSelectedIndex === index ? "flip-card-inner hightlighted" : "flip-card-inner"
                                    }>
                                        <div className="flip-card-front"></div>
                                        <div className="flip-card-back">
                                            {card}
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    <div className={this.state.gameStarted ? "score-container" : "hidden"}>
                        <div className={this.state.playerTurn === 1 ? "score-counter current-player-turn"  : "score-counter none-player-turn"}>
                            { this.state.cardsFound && this.state.pickedPack.map(
                                (card, index) => (
                                    <div className={this.state.cardsFound[0].includes(card) ? "" : "greyed"} key={index} >{card}</div>
                                )
                            )}
                        </div>

                        <div className={this.state.gameModeSelected === "hard" ? "score-counter current-player-turn turns-left" : "hidden"}>
                            {this.state.turnsLeft}
                        </div>

                        <div className={`${playerTwoTurn} ${twoPlayers}`}>
                        { this.state.cardsFound && this.state.pickedPack.map(
                            (card, index) => (
                                <div className={this.state.cardsFound[1].includes(card) ? "" : "greyed"} key={index} >{card}</div>
                            )
                        )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
