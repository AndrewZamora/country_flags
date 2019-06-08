import React, { Component } from 'react'
import styles from './layout.module.css'

const url = "https://restcountries.eu/rest/v2/all";

const fetchCountries = () => {
  return fetch(url).then((response) => {
    return response.json();
  })
}

const getRandomNumFromZeroTo = num => {
  return Math.floor(Math.random() * num);
}

const getRandomCountries = (countries, amount) => {
  const randomCountries = [];
  const remainingCountries = [...countries];
  const randomIndex = getRandomNumFromZeroTo(remainingCountries.length - 1);
  for (let i = 0; i < amount; i++) {
    randomCountries.push(remainingCountries[randomIndex]);
    remainingCountries.splice(randomIndex, 1);
  }
  return randomCountries;
}

const createMultiChoice = (choices, onClick) => {
  return choices.map((choice, index) => {
    return (
      <React.Fragment key={`${choice}${index}`}>
        <input type="radio" id={choice} name={choice} value={choice} onClick={onClick} />
        <label>{choice}</label>
      </React.Fragment>
    );
  });
}

const Yo = () => {
  return <div>yo</div>
}


export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      countries: [],
      randomSet: [],
      answer: [],
      selection: ''
    }
  }

  componentDidMount() {
    fetchCountries().then((data) => {
      this.setState({
        countries: data
      })
    }).then(() => {
      const intialSet = getRandomCountries(this.state.countries, 4);
      this.setState({
        randomSet: intialSet
      })
    }).then(() => {
      this.setAnswer();
    })
  }

  setAnswer = () => {
    const { randomSet } = this.state;
    this.setState({
      answer: randomSet[getRandomNumFromZeroTo(randomSet.length - 1)]
    });
  }

  renderProblem = () => {
    const { randomSet } = this.state;
    const countryNames = randomSet.map(country => {
      return country.name;
    })
    return (
      <React.Fragment>
        {createMultiChoice(countryNames, this.handleOnClick)}
      </React.Fragment>
    );
  }

  handleSubmit = (event) => {
    event.preventDefault();
    return alert('hello');
  }

  handleOnClick = (event) => {
    this.setState({ selection: event.target.value });
  }

  reset = () => {
    const newSet = getRandomCountries(this.state.countries, 4);
    const newAnswer = newSet[getRandomNumFromZeroTo(newSet.length - 1)]
    return this.setState({
      randomSet: newSet,
      answer: newAnswer,
      selection: ''
    })
  }

  componentDidUpdate() {
    const { answer, selection } = this.state
    if (answer.name === selection) {
      console.log('Correct!')
      this.reset();
    }
    if (selection !== '' && answer.name !== selection) {
      console.log("Keep trying!")
    }
  }

  render() {
    return (
      <main className={styles.main}>
        <h1>Guess the Flag</h1>
        <img className={styles.flag} src={this.state.answer.flag} alt="flag" />
        <div>
          {this.renderProblem()}
        </div>
      </main>
    )
  }
}
