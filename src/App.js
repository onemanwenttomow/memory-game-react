import React, { Component } from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shuffledCards: [],
            selectedCards: [],
            firstSelectedIndex: null,
            secondSelectedIndex: null,
            pairs: [],
            isInMotion: false,
            currentScore: 0,
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
            gameStarted: true
        })
        var totalCards = this.state.choiceOfPacks[deckNumber].concat(this.state.choiceOfPacks[deckNumber].slice());
        this.setState({
            shuffledCards: this.shuffleArray(totalCards)
            // shuffledCards: totalCards
        });
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
    handleClick(card, index) {
        // don't allow click during animation
        if (this.state.isInMotion) {
            return;
        }
        // grab the currently selected card (if any) from state
        let currentSelectedCard = this.state.selectedCards;

        // don't allow the user to click the same card again.
        if (this.state.selectedCards.length === 1) {
            if (this.state.selectedCards[0].index === index) {
                console.log("already clicked!");
                return;
            }
        }
        // add the current card and it's index an array.
        currentSelectedCard.push({card, index});

        // if there is only 1 card selected. Update state.
        if (currentSelectedCard.length === 1) {
            console.log("one card selected");
            this.setState({
                selectedCards: currentSelectedCard,
                firstSelectedIndex: index
            });
        // if 2 cards are selected.
        } else if (currentSelectedCard.length === 2) {
            console.log("two cards selected");
            if (this.state.selectedCards[0].index === index) {
                return;
            }
            // update state.
            this.setState({
                selectedCards: currentSelectedCard,
                secondSelectedIndex: index,
                isInMotion: true
            });
            // and then check for a pair.
            this.checkForPair();

            setTimeout(() => {
                this.setState({
                    selectedCards: [],
                    firstSelectedIndex: null,
                    secondSelectedIndex: null,
                    isInMotion: false
                });
            }, 1000)
        }

    }
    checkForPair() {
        if (this.state.selectedCards[0].card === this.state.selectedCards[1].card) {
            this.setState({ isInMotion: true });
            setTimeout(() => {
                let newPairs = this.state.pairs;
                newPairs.push(this.state.selectedCards[0].index, this.state.selectedCards[1].index);
                let currentScore = this.state.currentScore;
                currentScore += 2;
                this.setState({
                    pairs: newPairs,
                    isInMotion: false,
                    currentScore: currentScore
                })
                if (currentScore === this.state.shuffledCards.length) {
                    newPairs = [];
                    this.setState({
                        gameStarted: false
                    })
                }
            }, 900)
        }
    }
    render() {
        return (
            <div className="App">
                <div className={this.state.gameStarted ? "hidden" : "pickpack-container"}>
                    { this.state.choiceOfPacks.map(
                        (card, index) => (
                            <div className="pickpack" key={index} onClick={e => this.setupNewGame(index)}>{card}</div>
                        )
                    )}
                </div>
                <div className={this.state.gameStarted ? "board" : "board hidden"}>
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
            </div>
        );
    }
}

export default App;
