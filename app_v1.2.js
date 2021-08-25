import React from 'react';
import { Modal } from "semantic-ui-react";
import './app_v1.2.css';
import Axios from 'axios'

class TopPart extends React.Component {
    render() {
        return(
            <div className="TopPartDiv">
                <h1 className="AimOfMeeting" id="AimOfMeeting">Собираемся на:</h1>
                <p className="CodeOfMeeting" id="CodeOfMeeting">Код собрания:</p>
            </div>
        )
    }
}
class MiddlePart extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            amountOfWeeksFirstMonthState: 0,
            amountOfWeeksSecondMonthState: 0,
            renderingMonth: 0,
            chosenDay: "",
        }
    }

    componentDidMount() {
        let firstMonth = this.renderMonths(0);
        let secondMonth = this.renderMonths(1);
        this.props.sendAmountOfDays(firstMonth.length + secondMonth.length);
        let data = [];
        for(let i = 0; i < firstMonth.length + secondMonth.length; i++) {
            data[i]="";
        }
        this.setState({
            chosenDay: data,
        });
    }

    handleClick = (i) => {
        let data = this.state.chosenDay;
        document.getElementById("id" + i).style.textDecorationColor = this.props.recieveColor;
        data[i] = this.props.recieveColor;
        this.setState({
            chosenDay: data,
        })
        this.props.sendSelectedDays(data);
    }
    previousMonth = (event) => {
        this.setState({
            renderingMonth: 0,
        })
        document.getElementById("FirstMonthTable").style.display = "";
        document.getElementById("SecondMonthTable").style.display = "none";
        event.preventDefault();
    }
    nextMonth = (event) => {
        this.setState({
            renderingMonth: 1,
        })
        document.getElementById("FirstMonthTable").style.display = "none";
        document.getElementById("SecondMonthTable").style.display = "";
        event.preventDefault();
    }
    renderMonths(state) {
        let date = new Date();
        let firstDayOfMonthUpd;
        let day = 1;
        let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth() + state, 1);
        let lastDayOfMonth = new Date(date.getFullYear(),date.getMonth() + 1 + state, 0);
        
        if (firstDayOfMonth.getDay() === 0) {
            firstDayOfMonthUpd = 7;
        } else {
            firstDayOfMonthUpd = firstDayOfMonth.getDay();
        }

        let amountOfDays = firstDayOfMonthUpd + lastDayOfMonth.getDate();
        let amountOfWeeks = Math.ceil(amountOfDays / 7);
        let month = [amountOfWeeks * 7];

        for (let i = 0; i < amountOfWeeks * 7; i++) {
            month[i] = "";
        }

        for (let i = firstDayOfMonthUpd - 1; i < lastDayOfMonth.getDate() + firstDayOfMonthUpd - 1; i++) {
            month[i] = day;
            day++;
        }

        return month;
    }

    render() {
        let date = new Date();
        let monthsArray = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
        let weekArray = ["ПН","ВТ","СР","ЧТ","ПТ","СБ","ВС"];
        let firstMonth = this.renderMonths(0);
        let secondMonth = this.renderMonths(1);
        return(
            <div className="MiddlePartDiv">
                <div className="ChoosingMonthToRender">
                    <p className="SelectionOfPreviousMonth" onClick={this.previousMonth}>prev</p>
                    <p className="CurrentMonth" >{monthsArray[date.getMonth() + this.state.renderingMonth]}</p>
                    <p className="SelectionOfNextMonth" onClick={this.nextMonth}>next</p>
                </div>
                <div className="RenderingTableOfDays">
                    <ul className="Week"> {
                            weekArray.map((row, i) => { return ( <li key={"k" + i}>{row}</li> )})
                    } </ul>
                    <div className="FirstMonthTable" id="FirstMonthTable">
                        {
                            firstMonth.map((row, i) => {
                                if ((i + 1) % 7 !== 0 && (i + 2) % 7 !== 0) {
                                    return (
                                        <p className="Workdays" id={"id" + i} key={i} onClick={() => this.handleClick(i)}>{row}</p>
                                    )
                                } else {
                                    return (
                                        <p className="Weekends" id={"id" + i} key={i} onClick={() => this.handleClick(i)}> {row} </p>
                                    )
                                }
                            })
                        }
                    </div>
                    <div className="SecondMonthTable" id="SecondMonthTable" style={{display: "none"}}>
                        {
                            secondMonth.map((row, i) => {
                                if ((i + 1) % 7 !== 0 && (i + 2) % 7 !== 0) {
                                    return (
                                        <p className="Workdays" id={"id" + (i + firstMonth.length)} 
                                                            key={(i + firstMonth.length)}
                                                            onClick={() => this.handleClick((i + firstMonth.length))}> {row} </p> 

                                    )
                                } else {
                                    return (
                                        <p className="Weekends" id={"id" + (i + firstMonth.length)}
                                                                key={(i + firstMonth.length)}
                                                                onClick={() => this.handleClick((i + firstMonth.length))}> {row} </p>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

class BottomPart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openAuthentificationModal: false,
            openOpenCreationModal: false,
            openSendDecisionModal: false,
            freeDaysOfGroup: "",
            selectedDays: "",
            code: "",
            state: false,
        }
    }
    
    positive = (event) => {
        document.getElementById("Negative").style.color = "black";
        document.getElementById("Ambivalent").style.color = "black";
        document.getElementById("Positive").style.color = "#6DD176";
        this.props.sendColor("#6DD176");
        event.preventDefault();
    }

    ambivalent = (event) => {
        document.getElementById("Negative").style.color = "black";
        document.getElementById("Ambivalent").style.color = "grey";
        document.getElementById("Positive").style.color = "black";
        this.props.sendColor("grey");
        event.preventDefault();
    }

    negative = (event) => {
        document.getElementById("Negative").style.color = "#E26159";
        document.getElementById("Ambivalent").style.color = "black";
        document.getElementById("Positive").style.color = "black";
        this.props.sendColor("#E26159");
        event.preventDefault();
    }

    setOpenAuthentificationModal(state) {
        this.setState({
            openAuthentificationModal: state,
        })
    }

    setOpenCreationModal(state) {
        this.setState({
            openOpenCreationModal: state,
        })
    }
    
    setOpenSendDecisionModal(state) {
        this.setState({
            openSendDecisionModal: state,
        })
    }

    authorization() {
        let code = document.getElementById("CodeValue").value;
        let name = document.getElementById("NameValue").value;
        if (code === "" || name === "") {
            alert("Проверьте заполнение полей!");
        } else {
            Axios.post("https://project-calendar-backend.herokuapp.com/authorization", {
                userName: name,
                codeOfMeeting: code,
            }).then((response) => {
                if (response.data === "Error! Check the code") {
                    document.getElementById("HeaderOfModal").innerHTML = "Проверь код";
                }
                else {
                    document.getElementById("AimOfMeeting").innerHTML = "Собираемся на: " + response.data;
                    document.getElementById("CodeOfMeeting").innerHTML = "Код: " + code;
                    document.getElementById("SalutoryPart").style.display = "none";
                    document.getElementById("SecondartPart").style.display = "";
                    this.setState({
                        state: true,
                        code: code,
                        name: name,
                    })
                    this.showBusyDaysFunction();
                    this.getFreeDaysFromDB();
                }
            })
        }
    }
    creation() {
        let aim = document.getElementById("AimValue").value;
        let name = document.getElementById("NameValue").value;
        if (aim === "" || name === "") {
            alert("Проверьте заполнение полей!");
        } else {
            Axios.post("https://project-calendar-backend.herokuapp.com/creation", {
                    creatorName: name,
                    aimOfMeeting: aim,
                }).then((response) => {
                    document.getElementById("CodeOfMeeting").innerHTML = "Код: " + response.data;
                    document.getElementById("SalutoryPart").style.display = "none";
                    document.getElementById("SecondartPart").style.display = "";
                    this.setState({
                        state: true,
                        code: response.data,
                        name: name,
                    })
                    this.showBusyDaysFunction();
                    this.getFreeDaysFromDB();
                });
            document.getElementById("AimOfMeeting").innerHTML = "Собираемся на: " + aim;
        }
    }
    getFreeDaysFromDB() {
        Axios.post("https://project-calendar-backend.herokuapp.com/showingFreeDays", {
            codeOfMeeting: this.state.code,
        }).then((response) => {
            this.setState({
                freeDaysOfGroup: response.data,
            });
            this.setOpenCreationModal(false);
            this.setOpenAuthentificationModal(false);
        });
    }
    showFreeDaysFunction() {
        let state;
        let result = this.state.freeDaysOfGroup;

        (document.getElementById("ShowOtherDecisions").innerHTML === "Скрыть занятость других") ? state = false : state = true;

        if (state) {
            for(let i = 0; i < this.props.recieveAmountOfDays; i++) {
                switch (result[i]) { 
                    case ('1'): document.getElementById("id" + i).style.color = "#E26159"; break;
                    case ('2'): document.getElementById("id" + i).style.color = "grey"; break;
                    case ('3'): document.getElementById("id" + i).style.color = "#6DD176"; break;
                    default:
                        document.getElementById("id" + i).style.color = "black";
                        if ((i + 1) % 7 === 0 || (i + 2) % 7 === 0) {
                            document.getElementById("id" + i).style.color = "#ECC49C";
                        }
                    break;
                }
            }
            document.getElementById("ShowOtherDecisions").innerHTML = "Скрыть занятость других";
        } else {
            for (let i = 0; i < this.props.recieveAmountOfDays; i++) {
                document.getElementById("id" + i).style.color = "black";
                if ((i + 1) % 7 === 0 || (i + 2) % 7 === 0) {
                    document.getElementById("id" + i).style.color = "#ECC49C";
                }
            }
            document.getElementById("ShowOtherDecisions").innerHTML = "Показать занятость других";
        }        
    }
    showBusyDaysFunction() {
        Axios.post("https://project-calendar-backend.herokuapp.com/showingBusyDays", {
                code: this.state.code,
                name: this.state.name,
            }).then((response) => {
                let personalDays = response.data;
                for (let i = 0; i < this.props.recieveAmountOfDays; i++) {
                    switch (personalDays[i]) {
                        case ('1'): document.getElementById("id" + i).style.textDecorationColor = "rgb(226,97,89,0.5)"; break;
                        case ('2'): document.getElementById("id" + i).style.textDecorationColor = "rgb(175,175,175,0.5)"; break;
                        case ('3'): document.getElementById("id" + i).style.textDecorationColor = "rgb(109,209,118,0.5)"; break;
                        default: document.getElementById("id" + i).style.textDecorationColor = "white"; break;
                    }
                }
                this.setOpenCreationModal(false);
                this.setOpenAuthentificationModal(false);
            });
    }
    sendDataToDB() {
        Axios.post("https://project-calendar-backend.herokuapp.com/choosingDay", {
            userName: this.state.name,
            codeOfMeeting: this.state.code,
            day: this.props.recieveSelectedDays,
        });
        this.setOpenSendDecisionModal(true)
    }
    render() {
        return(
            <div className="BottomPartDiv">
                <div className="SecondartPart" id="SecondartPart" style={{display:"none"}}>
                    <p className="TextToHelp">Выберите вариант</p>
                    <div className="ColorSelection">
                        <p className="Negative" id="Negative" onClick={this.negative}>Не могу</p>
                        <p className="Ambivalent" id="Ambivalent" onClick={this.ambivalent}>Не уверен</p>
                        <p className="Positive" id="Positive" onClick={this.positive}>Могу</p>
                    </div>
                    <div className="AdditionalActions">
                        <p className="ShowOtherDecisions" id="ShowOtherDecisions" onClick={() => this.showFreeDaysFunction()}>Показать занятость других</p>
                        <p className="SendDecision" onClick={() => this.sendDataToDB()}>Отправить выбранные дни</p>
                    </div>
                </div>
                <div className="SalutoryPart" id="SalutoryPart">
                    <p className="Authentification" onClick={() => this.setOpenAuthentificationModal(true)}>Войти</p>
                    <p className="Creation" onClick={() => this.setOpenCreationModal(true)}>Создать</p>
                </div>
                <div className="ModalParts">
                    <Modal
                        onClose={() => this.setOpenAuthentificationModal(false)}
                        onOpen={() => this.setOpenAuthentificationModal(true)}
                        open={this.state.openAuthentificationModal}
                        className="AuthentificationModal" >
                        
                        <Modal.Content>
                            <p className="HeaderOfModal" id="HeaderOfModal">Авторизация</p>
                            <label htmlFor="CodeValue">Введите код: </label>
                            <input className="CodeValue" id="CodeValue" type="text" name="CodeValue" />
                            <label htmlFor="NameValue">Введите имя: </label>
                            <input className="NameValue" id="NameValue" type="text" name="NameValue" />
                            <button className="CancelButton" onClick={() => this.setOpenAuthentificationModal(false)}>Назад</button>
                            <button className="ApproveButton" onClick={() => this.authorization()} > Войти </button>
                        </Modal.Content>
                    </Modal>
                    
                    <Modal 
                        onClose={() => this.setOpenCreationModal(false)}
                        onOpen={() => this.setOpenCreationModal(true)}
                        open={this.state.openOpenCreationModal}
                        className="CreationModal">
                        
                        <Modal.Content>
                            <p className="HeaderOfModal">Создать встречу</p>
                            <label htmlFor="AimValue">Цель:</label>
                            <input className="AimValue" id="AimValue" type="text" name="AimValue" />
                            <label htmlFor="NameValue">Инициатор: </label>
                            <input className="NameValue" id="NameValue" type="text" name="NameValue" />
                            <button className="CancelButton" onClick={() => this.setOpenCreationModal(false)}>Назад</button>
                            <button id="СreateButton" className="СreateButton" onClick={() =>  this.creation()} > Создать </button>
                        </Modal.Content>
                    </Modal>

                    <Modal 
                        onClose={() => this.setOpenSendDecisionModal(false)}
                        onOpen={() => this.setOpenSendDecisionModal(true)}
                        open={this.state.openSendDecisionModal}
                        className="SendDecisionModal">
                        
                        <Modal.Content>
                            <p className="HeaderOfModal" >Спасибо за использование!</p>
                            <p className="JustText">Введенные результаты учтены. Если необходимо изменить, дни нажмите соответствующую кнопку. В противном случае просто закройте вкладку. </p>
                            <button className="ChangeButton" onClick={() => {this.setOpenSendDecisionModal(false); this.getFreeDaysFromDB();}} >Изменить </button>
                        </Modal.Content>
                    </Modal>
                </div>
            </div>
        )
    }
}

class Parent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDays: "",
            amountOfDays: "",
            color: "white",
            state: false,
        }
    }
    recieveColor = (currentColor) => {
        this.setState({
            color: currentColor,
        })
    }
    sendSelectedDays = (array) => {
        this.setState({
            selectedDays: array,
        })
    }
    recieveAmountOfDays = (number) => {
        this.setState({
            amountOfDays: number,
        })
    }
    render (){
        return (
            <div>
                <TopPart />
                <MiddlePart recieveColor={this.state.color}
                            sendSelectedDays={this.sendSelectedDays}
                            sendAmountOfDays={this.recieveAmountOfDays}/>
                <BottomPart sendColor={this.recieveColor}
                            recieveSelectedDays={this.state.selectedDays}
                            recieveAmountOfDays={this.state.amountOfDays}/>
            </div>
        )
    }
}
export default Parent;