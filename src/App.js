import React, {Component} from 'react';
import './App.css';

let getTime = () => {
    let date = new Date();
    let dateString = date.toString().split(' ');
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    return `${dateString[3]}-${month}-${dateString[2]} ${dateString[4]}`;
};

class App extends Component {
    state = {
        result: '',
        buffer1: '',
        buffer2: '',
        operator: '',
        iteration: '1',
        display: '',
        log: [],
    };
    
    componentWillMount = () => {
        this.setState({
            log: JSON.parse(localStorage.getItem('log'))
        });
    };
    
    clickHandler = (e) => {
        let event = e.target.dataset.val;
        
        switch (event) {
            case '=':
                let result = () => {
                    let first = +this.state.buffer1;
                    let second = +this.state.buffer2;
                    if (this.state.iteration === '1')
                        return first;
                    if (this.state.iteration === '3')
                        return '';
                    switch (this.state.operator) {
                        case '+':
                            return first + second;
                        case '-':
                            return first - second;
                        case '*':
                            return first * second;
                        case '/':
                            return first / second;
                        default:
                            break;
                    }
                };
                
                let log = `${getTime()} <b>${this.state.buffer1} ${this.state.operator} ${this.state.buffer2} = ${result()}<b>`;
                
                this.setState(prevState => ({
                    log: [...prevState.log, log]
                }),()=> {
                    localStorage.setItem('log', JSON.stringify(this.state.log));
                });
                
                this.setState({
                    display: result(),
                    result: result(),
                    operator: '',
                    buffer1: result(),
                    buffer2: '',
                    iteration: '3',
                });
                
                break;
            case 'AC':
                this.setState({
                    buffer1: '',
                    buffer2: '',
                    iteration: '1',
                    operator: '',
                    result: '',
                    display: ''
                });
                break;
            case '%':
                if (this.state.iteration === '1' || this.state.iteration === '3') {
                    let percent = this.state.buffer1 / 100;
                    this.setState({
                        buffer1: percent,
                        display: percent
                    });
                } else if (this.state.iteration === '2' && !this.state.buffer2.length) {
                    let percent = this.state.buffer1 / 100;
                    this.setState({
                        buffer1: percent,
                        display: percent
                    });
                } else if (this.state.iteration === '2' && this.state.buffer2.length) {
                    let percent = this.state.buffer2 / 100;
                    this.setState({
                        buffer2: percent,
                        display: percent
                    });
                }
                break;
            case '±':
                if (this.state.iteration === '1' || this.state.iteration === '3') {
                    let minus = -this.state.buffer1;
                    this.setState({
                        buffer1: minus,
                        display: minus
                    });
                } else if (this.state.iteration === '2' && !this.state.buffer2.length) {
                    let minus = -this.state.buffer1;
                    this.setState({
                        buffer1: minus,
                        display: minus
                    });
                } else if (this.state.iteration === '2' && this.state.buffer2.length) {
                    let minus = -this.state.buffer2;
                    this.setState({
                        buffer2: minus,
                        display: minus
                    });
                }
                break;
            case '+' :
            case '-' :
            case '*' :
            case '/' :
                this.setState({
                    iteration: '2',
                    operator: event,
                });
                break;
            default:
                if (this.state.iteration === '1') {
                    let string = `${this.state.buffer1}${event}`;
                    this.setState({
                        buffer1: string,
                        display: string
                    });
                } else if (this.state.iteration === '2') {
                    let string = `${this.state.buffer2}${event}`;
                    this.setState({
                        buffer2: string,
                        display: string
                    });
                } else {
                    this.setState({
                        iteration: '1',
                        buffer1: event,
                        buffer2: '',
                        display: event
                    });
                }
        }
    };
    
    
    
    render() {
        let template = [{name: 'AC', val: 'AC'}, {name: '±', val: '±'}, {name: '%', val: '%'},
            {name: '÷', val: '/'}, {name: '7', val: '7'}, {name: '8', val: '8'}, {name: '9', val: '9'},
            {name: '×', val: '*'}, {name: '4', val: '4'}, {name: '5', val: '5'}, {name: '6', val: '6'},
            {name: '-', val: '-'}, {name: '1', val: '1'}, {name: '2', val: '2'}, {name: '3', val: '3'},
            {name: '+', val: '+'}, {name: '0', val: '0'}, {name: ',', val: '.'}, {name: '=', val: '='},
        ];
        return (
            <div className="App">
                <div className="App__container">
                    <div className="App__screen-container">
                        <input type="text" readOnly="true" placeholder="0" className="App__screen"
                               value={this.state.display}>
                        </input>
                        <div className="App__operator">
                            {this.state.operator}
                        </div>
                    </div>
                    <div className="App__btns-container">
                        {template.map((item, i) => {
                            return (
                                <div key={i} onClick={e => this.clickHandler(e)} data-val={item.val}
                                     className='App__btn noselect'>
                                    {item.name}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="App__log">
                    История операций:
                    {this.state.log.map((item, i) => {
                        return (
                            <div key={i} className='App__log-row' dangerouslySetInnerHTML={{__html: item}}/>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default App;