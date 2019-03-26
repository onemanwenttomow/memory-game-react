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
                ["⚾", "⚽", "🏉", "🏈", "🎾", "🎳", "🏏", "🏑", "⛳",  "🥇", "⛳", "🎽"],
                ["🚅", "🚂", "🚌", "🚑", "🚒", "🚓", "🚕", "🚚", "🏎️", "🏍️", "🚲", "✈️"]
            ]
        };
        this.shuffleArray = this.shuffleArray.bind(this);
        this.checkForPair = this.checkForPair.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.setupNewGame = this.setupNewGame.bind(this);
    }
    componentDidMount() {
        // this.setupNewGame();
    }
    setupNewGame(index) {
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
        console.log(index);
        console.log(this.state.choiceOfPacks);
        var totalCards = this.state.choiceOfPacks[index].concat(this.state.choiceOfPacks[index].slice());
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
        if (this.state.isInMotion) {
            return;
        }

        let currentSelectedCard = this.state.selectedCards;
        if (this.state.selectedCards.length === 1) {
            if (this.state.selectedCards[0].index === index) {
                return;
            }
        }

        currentSelectedCard.push({card, index});

        if (currentSelectedCard.length === 1) {
            this.setState({
                selectedCards: currentSelectedCard,
                firstSelectedIndex: index
            });
        } else if (currentSelectedCard.length === 2) {
            if (this.state.selectedCards[0].index === index) {
                return;
            }
            this.setState({
                selectedCards: currentSelectedCard,
                secondSelectedIndex: index,
                isInMotion: true
            });
            setTimeout(() => {
                this.setState({
                    selectedCards: [],
                    firstSelectedIndex: null,
                    secondSelectedIndex: null,
                    isInMotion: false
                });
            }, 1000)
        }

        this.checkForPair()
    }
    checkForPair() {
        if (this.state.selectedCards.length === 2) {
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
                <div id="board">
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
