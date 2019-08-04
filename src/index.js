// Main depenedencies
import React from 'react';
import ReactDOM from 'react-dom';
// Custom CSS
import './style.css';

/**
 * MathTest class - main element
 * Calls the Environment class
 */
class MathTest extends React.Component {
  render() {
    return (
      <div className="mathTest">
        <Environment/>
      </div>
    );
  }
}

/**
 * Environment class
 */
class Environment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	showEnv: true,
    	numberOfTasks: null,
    	difficulty: 1
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /* Updates state on input change */
  handleChange(event) {
    const target = event.target;
    const value  = target.value;
    const name   = target.name;

    this.setState({
      [name]: value
    });
  }

  /* If all fields are set, hides the setup and shows the test */
  handleSubmit(event) {
  	event.preventDefault();

  	const { showEnv, numberOfTasks, difficulty } = this.state;

  	if (numberOfTasks && difficulty) {
  		this.setState({
      	showEnv: !showEnv,
    	});	
  	}

  }

  /* Render the environment form and pass state data to the test */
  render() {
  	if (this.state.showEnv) {
	    return (
	      <div className="envBox">
	      	<form className="envForm" onSubmit={this.handleSubmit}>
	      	 	<fieldset>
	      	 	 	<div className="col-25">
		  					<label>Broj zadataka:</label>
		  				</div>
		  				<div className="col-75">
		   				 	<input type="number" name="numberOfTasks" min="1" max="20" pattern="^[0–9]$" required value={this.state.value} onChange={this.handleChange} />
		   				</div>
	  				</fieldset>  
	  				<fieldset>
	  					<div className="col-25">  
	        			<label>Razina težine:</label>    
	        		</div>
	        		<div className="col-75"> 
		        		<select name="difficulty" value={this.state.value} onChange={this.handleChange}>
	            		<option value="1">1</option>
	            		<option value="2">2</option>
	            		<option value="3">3</option>
	         			</select>
	         		</div>  
	    			</fieldset>
	    			<fieldset>
	    				<div className="col-100"> 
								<input type="submit" value="Započni test" />  					
							</div>
	  				</fieldset>
					</form>
	      </div>
	    ); 		
  	} else {
  		return (
  			<MathTasks {...this.state}/>
  		)
  	}
  }
}

/**
 * MathTasks class
 */
class MathTasks extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
    	showResult: false,
    	endResult: 0,
    	tasks: []
    };

    this.handleTestSubmit = this.handleTestSubmit.bind(this);
  }

	handleTestSubmit(event) {
  	event.preventDefault();

  	document.getElementById("submitResult").disabled = true;

  	let numberOfTasks           = this.props.numberOfTasks;
  	let numOfCorrectAnswers     = 0;
  	let percentOfCorrectAnswers = 0;
  	let tasks                   = document.querySelectorAll('.task > input');

  	// Calculate the result
  	tasks.forEach(function(task) {
  		let taskResult = task.getAttribute('result');
  		let taskValue  = task.value;

  		if (taskValue !== "undefined" && taskValue === taskResult) {
  			numOfCorrectAnswers++;
  			task.classList.add("correct");
  			task.classList.remove("incorrect");
  		} else {
  			task.classList.add("incorrect");
  			task.classList.remove("correct");
  		}

  		let text = document.createTextNode( " [ " + taskResult + " ] " );
  		task.parentNode.appendChild(text);
	});

	percentOfCorrectAnswers = numOfCorrectAnswers / numberOfTasks * 100;
	percentOfCorrectAnswers = percentOfCorrectAnswers.toFixed(2);

  	this.setState({
      showResult: true,
      endResult: percentOfCorrectAnswers
    });	
  }

	renderTasks() {
		if (this.state.tasks.length == 0) {
			const numberOfTasks = this.props.numberOfTasks;
			const difficulty    = this.props.difficulty;
			let tasks           = [];

			for (let i = 0; i < numberOfTasks; i++) {
				tasks.push(<Task id={i} {...this.props}/>);
			}

			this.setState({
	      		tasks: tasks
	    	});
		}

		return (
			<form className="taskForm" onSubmit={this.handleTestSubmit}>
				{this.state.tasks}
				<fieldset>
	    		<div className="col-100"> 
						<input type="submit" id="submitResult" value="Provjeri rezultat" />  					
					</div>
	  		</fieldset>
			</form>
		)
	}

	render() {
	  return (
	    <div>
	    	<div className="taskBox">
					{this.renderTasks()}
				</div>
				<div className="resultsBox">
					<Result {...this.state}/>
				</div>
			</div>
	  );
	}
}

/**
 * Task class
 */
class Task extends React.Component {
	/* Depending on difficulty generate single task */
	createTask(difficulty) {
		let task              = '';
		let numberOfVars      = 2;
		let tmpVar            = 0;
		let j                 = 0;
		let possibleOperators = '+-';
		let operator          = '+';

	 	/**
	 	 * NOTE - difficulty level should be programmed to corespond to classes 
	 	 * i.e. first grade, second...
	 	 * Currently the rules are improvised
	 	 * For additional code explenation look for last else if
	 	 */
		if (difficulty == 1) {
			numberOfVars = Math.floor(Math.random() * 3 + 2);

			for (j; j < numberOfVars; j++) {
				tmpVar   = Math.floor(Math.random() * 20);
		 		operator = possibleOperators.charAt(Math.floor(Math.random() * possibleOperators.length));

				if (j != numberOfVars - 1) {
					task += tmpVar + operator;
				} else {
					task += tmpVar;
				}
			}
		} else if (difficulty == 2) {
			numberOfVars      = Math.floor(Math.random() * 5 + 2);
			possibleOperators = '+-*/';

			for (j; j < numberOfVars; j++) {
				tmpVar   = generateRandom(2);
		 		operator = possibleOperators.charAt(Math.floor(Math.random() * possibleOperators.length));

		 		if (tmpVar < 0) {
		 			tmpVar = '(' + tmpVar + ')';
		 		}

				if (j != numberOfVars - 1) {
					task += tmpVar + operator;
				} else {
					task += tmpVar;
				}
			}
		} else if (difficulty == 3) {
			/**
			 * Set count of numbers to be used. Additionly, in this case an even number
			 * to prevent bugs because of unclosed brackets. Code is to basic :)
			 * Define possible operators to be used.
			 */
			numberOfVars      = Math.floor(Math.random() * 3 + 2) * 2;
			possibleOperators = '+-*/';

			for (j; j < numberOfVars; j++) {
				/* Generate a number and a operator to be used. */
				tmpVar   = generateRandom(3);
		 		operator = possibleOperators.charAt(Math.floor(Math.random() * possibleOperators.length));

		 		/* If number is negative, add brackets */
		 		if (tmpVar < 0) {
		 			tmpVar = '(' + tmpVar + ')';
		 		}

		 		/**
		 		 * Generate task
		 		 */
				if (j != numberOfVars - 1 && (j % 2) == 0 ) {
					task += '(' + tmpVar + ' ' + operator + ' ';
				} else if (j != numberOfVars - 1 && (j % 2) != 0 ) {
					task += tmpVar + ')' + ' ' + operator + ' ';
				} else { 
					task += tmpVar + ')';
				}
			}
		}

		return task;
	}

	render() {
		let difficulty = this.props.difficulty;
		let task       = '';
		let result     = 0;

		// This option is not enabled yet in the input field
		do {
			task   = this.createTask(difficulty); 
			result = eval(task);
		} while (result === "Infinity")

		let key = 'task' + this.props.id;

		if (result % 1 !== 0) {
			result = result.toFixed(2);
		} else {
			result = result.toFixed(0);
		}

    return (
		<fieldset className="task">{task} =	<input type="number" step="0.01" name={key} result={result} /></fieldset>
    );
  }
}

/**
 * Result class
 */
class Result extends React.Component {
	restartTest() {
		window.location.reload();
	}

	render() {
		if (this.props.showResult) {
			return (
    		<div>
    			<div className="col-100">
    				Postotak točno riješenih zadataka: {this.props.endResult}%
    			</div>
    			<div className="col-100"> 
    				<div className="buttonRow">
    					<button type="button" onClick={ this.restartTest.bind(this) }>Pokreni novi test</button>
    				</div>
    			</div>
    		</div>
    	);
		} else {
			return null;
		}
  }
}

/**
 * Render main element by accessing root.
 */
ReactDOM.render(<MathTest />, document.getElementById("root"))

/**
 * Help functions
 */

/**
 * Generate random according to difficulty
 */
function generateRandom(lv) {
	var num = 0;

	if (lv === 2) {
	    num = Math.floor(Math.random() * 201) - 100;
	} else if (lv === 3) {
		num = Math.floor(Math.random() * 21) - 10
	}

    return (num === 0) ? generateRandom(lv) : num;
}