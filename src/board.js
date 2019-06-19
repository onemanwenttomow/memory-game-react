import React from 'react';

export function Board(props) {
    return (
        <div className="board">
            { props.shuffledCards.map(
                (card, index) => (
                    <div className={props.pairs.includes(index) ? "flip-card pair" : "flip-card"} key={index} onClick={e => props.handleClick(card, index)}>
                        <div className={
                            props.firstSelectedIndex === index ||
                            props.secondSelectedIndex === index ? "flip-card-inner hightlighted" : "flip-card-inner"
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
    );
}
