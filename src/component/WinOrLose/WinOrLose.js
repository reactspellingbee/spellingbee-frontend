import React from 'react';
import {connect} from "react-redux";
import {Redirect} from 'react-router-dom';
import {TextField} from "@material-ui/core";
import {saveScore} from '../../action/scores-actions';

export class WinOrLose extends React.Component {
  constructor(props) {
    super(props);
    const { name, difficulty } = this.props.words[0];
    const [score, finalWord] = this.calculateScore();
    this.state = {
      name: name,
      difficulty: difficulty,
      score: score,
      missedWord: finalWord,
      submit: false
    }
  }
  calculateScore = () => {
    let { words } = this.props;
    let score = 0;
    let finalWord = null;
    for (let i = 1; i < words.length; i++) {
      words[i].isCorrect ? score++ : finalWord = words[i].word;
    }
    return [score, finalWord];
  };
  winOrLose = () => {
    const { numberOfQuestions } = this.props.words[0];
    const [ score ] = this.calculateScore();
    return numberOfQuestions === score;
  };
  submitScore = (event) => {
    event.preventDefault();
    this.props.mappedSaveScore(this.state);
    this.setState({submit: true});
  };
  render() {
    let finalMessage = this.winOrLose()
      ? 'Congrats! You win.'
      : `Sorry, you lose. The correct spelling is ${this.state.missedWord}.`;

    return (
      <div>
        <h1>{finalMessage}</h1>

        <form onSubmit={this.submitScore}>
          <TextField
            id='name'
            value={this.state.name}
            margin='normal'
            readOnly
          />
          <TextField
            id='difficulty'
            value={this.state.difficulty}
            margin='normal'
            readOnly
          />
          <TextField
            id='numberOfQuestions'
            value={this.state.score}
            margin='normal'
            readOnly
          />
          { this.winOrLose() ?
            undefined :
            <TextField
              id='finalWord'
              value={this.state.missedWord}
              margin='normal'
              readOnly
            /> }

          <button type="submit">Save to Scoreboard</button>
        </form>

        { this.state.submit ? <Redirect to='/scores'/> : undefined }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    words: state.words,
    scores: state.scores
  }
};

const mapDispatchToProps = dispatch => ({
  mappedSaveScore: (formData) => dispatch(saveScore(formData))
});

export default connect(mapStateToProps, mapDispatchToProps)(WinOrLose);