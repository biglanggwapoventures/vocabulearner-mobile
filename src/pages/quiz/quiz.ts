import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Language } from './../../models/language';
import { Character } from './../../models/character';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Level } from './../../models/level';
import { LanguageServiceProvider } from './../../providers/language-service/language-service';
import { ViewChild } from '@angular/core';
import { Navbar } from 'ionic-angular';



@IonicPage()
@Component({
    selector: 'page-quiz',
    templateUrl: 'quiz.html',
    providers: [LanguageServiceProvider]
})
export class QuizPage {

    @ViewChild(Navbar) navBar: Navbar;

    static LEVEL_HISTORY_COUNT: number = 10;
    static INTERVAL: number = 2;
    static TYPING_ALLOWANCE: number = 2;
    static ELAPSED_TIME_PLACEHOLDER: number = 22;

    public characters: Character[];
    public selectedLanguage: Language;
    public level: Level;
    public choices: Character[];
    public answers: Character[]; 
    public levelNumber: number;
    public timer: number = 0;
    public interval;
    public answerWord: string;
    public score: number;
    public levelHistory: number[] = [];
    public levelStartTime: number;


    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        private languageService: LanguageServiceProvider,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController
    ) {
        this.selectedLanguage = navParams.get('selectedLanguage');
        this.characters = navParams.get('characters');
        this.resetGame();
        this.getPerformance();
    }

    ionViewDidLoad() {
        this.navBar.backButtonClick = (e:UIEvent) => {
            let alert = this.alertCtrl.create({
                enableBackdropDismiss: false,
                title: 'Exit to main menu',
                message: 'Are you sure you want to exit to main menu?',
                buttons: [{
                    text: 'Yes',
                    handler: () => {
                        this.goToMainMenu()
                    },
                },{
                    text: 'Nope'
                }]
            });
            alert.present();
        }
    }

    resetGame () {
        this.levelHistory = [];
        this.incrementTimer(90);
        this.score = 0;
        this.levelNumber = 1;
        this.getLevel();
    }


    getLevel(){
        let performance = this.getPerformance(),
            loader = this.loadingCtrl.create({
                content: "Loading level...",
            });
        loader.present();
        console.log(`getting level with difficulty of: ${performance}`);
        this.languageService.getLevel(this.selectedLanguage.id, performance)
            .then((level: Level) => {
                this.level = level;
                this.generateChoices();
                this.generateAnswerField();
                this.setAnswerWord();
                loader.dismiss();
                this.startTimer()
            })
    }

    setAnswerWord() {
        // console.log(this.level.answer);
        this.answerWord = this.level.answer.map(c => c.english_term).join('');
    }

    generateAnswerField() {
        this.answers = new Array<Character>(this.level.answer.length);
        this.answers.fill(null, 0);
    }

    generateChoices () {
        let choices: Character[] = Object.assign([], this.level.answer),
            maxIndex: number = this.characters.length - 1;
        choices.push(this.characters[this.random(0, maxIndex)])
        choices.push(this.characters[this.random(0, maxIndex)])
        this.shuffleCharacters(choices);
        while(choices.length < 12){
            choices.push(null);
        }
        this.choices = choices;
    }

    random (minimum, maximum) {
        return  Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    }
    

    shuffleCharacters(characters: Character[]) {
        for (let i = characters.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [characters[i], characters[j]] = [characters[j], characters[i]];
        }
    }

    performAnswer(choiceIndex: number){
        if(!this.timer){
            return;
        }
        let selectedCharacter = this.choices[choiceIndex];
        if(selectedCharacter.chosen){
            return;
        }
        selectedCharacter.chosen = true;
        let index = this.answers.indexOf(null),
            lastIndex = this.answers.length - 1;
        if(index !== -1){
            this.answers[index] = selectedCharacter
        }else if(!this.answers[lastIndex]){
            this.answers.push(selectedCharacter);
        }
        if(this.answerFieldIsFull()){
            this.checkAnswer();
        }
    }

    removeAnswer(index: number) {
        let selectedCharacter = this.answers[index];
        this.answers[index] = null;
        let choiceIndex = this.choices.indexOf(selectedCharacter);
        this.choices[choiceIndex].chosen = false;
    }

    checkAnswer(){
        /** Note: correct answer is based from the characters english term **/
        let answer = this.answers.map(c => c.english_term).join('');
        if(this.answerWord === answer){
            this.recordLapseTime();
            clearInterval(this.interval);
            this.incrementTimer();
            this.incrementScore();
            this.showScore();
            
        }
    }

    answerFieldIsFull() {
        return this.answers.indexOf(null) === -1;
    }    

    startTimer() {
        this.interval = setInterval(() => {
            this.timer--; 
            if(this.timer === 0){
                clearInterval(this.interval)
                this.showFailPrompt();
            }
        }, 1000);
    }

    incrementTimer(increment: number = 3) {
        this.timer += increment;
        this.levelStartTime = this.timer;
    }

    incrementScore() {
        this.score += this.answers.length;
    }

    incrementLevel() {
        this.levelNumber++;
    }

    showScore() {
        this.incrementLevel();
        let alert = this.alertCtrl.create({
            enableBackdropDismiss: false ,
            title: 'Level Passed',
            message: `Your score is now ${this.score}!`,
            buttons: [{
                text: `Proceed to level ${this.levelNumber}`,
                handler: () => {
                    this.getLevel();
                }
            }]
        });
        alert.present();
    }

    goToMainMenu(){
        this.navCtrl.popToRoot();
    }

    showFailPrompt () {
        this.answers = this.level.answer;
        return;
        // let alert = this.alertCtrl.create({
        //     enableBackdropDismiss: false,
        //     title: 'Time is up!',
        //     message: `The correct answer is ${this.level.image.language_origin_term}`,
        //     buttons: [{
        //         text: 'Play again',
        //         handler: () => {
        //             this.resetGame()
        //         },
        //     },{
        //         text: 'Main menu',
        //         handler: () => {
        //             this.navCtrl.popToRoot();
        //         },
        //     }]
        // });
        // alert.present();
    }

    recordLapseTime () {
        let timeElapsed: number =  this.levelStartTime - this.timer;
        this.levelHistory.push(timeElapsed);
        this.getPerformance();
    }
    

    getPerformance() {
        let recentLevelScores = this.padHistory(
            this.levelHistory.slice(QuizPage.LEVEL_HISTORY_COUNT * -1),
            QuizPage.LEVEL_HISTORY_COUNT,
            QuizPage.ELAPSED_TIME_PLACEHOLDER
        );
        console.log(recentLevelScores);
        let averageFn = (array) => array.reduce((a, b) => a + b) / array.length,
            average = averageFn(recentLevelScores),
            performance = this.determineUserPerformance(average);
        console.log(`average: ${average}, peformance: ${performance}`);
        return performance;
        // return 3;
        // return Math.round(performance);
    }


    determineUserPerformance(averageTime: number){
    
        if (averageTime<=QuizPage.TYPING_ALLOWANCE+(QuizPage.INTERVAL*1)){
            return 10;
        }else if (averageTime>QuizPage.TYPING_ALLOWANCE+(QuizPage.INTERVAL*1) && averageTime<=QuizPage.TYPING_ALLOWANCE+(QuizPage.INTERVAL*2)){
            return 9;
        }else if (averageTime>QuizPage.TYPING_ALLOWANCE+(QuizPage.INTERVAL*2) && averageTime<=QuizPage.TYPING_ALLOWANCE+(QuizPage.INTERVAL*3)){
            return 8;
        }else if (averageTime>QuizPage.TYPING_ALLOWANCE+(QuizPage.INTERVAL*3) && averageTime<=QuizPage.TYPING_ALLOWANCE+(QuizPage.INTERVAL*4)){
            return 7;
        }else if (averageTime>QuizPage.TYPING_ALLOWANCE+(QuizPage.INTERVAL*4) && averageTime<=QuizPage.TYPING_ALLOWANCE+(QuizPage.INTERVAL*5)){
            return 6;
        }else if (averageTime>QuizPage.TYPING_ALLOWANCE+(QuizPage.INTERVAL*5) && averageTime<=QuizPage.TYPING_ALLOWANCE+(QuizPage.INTERVAL*6)){
            return 5;
        }else if (averageTime>QuizPage.TYPING_ALLOWANCE+(QuizPage.INTERVAL*6) && averageTime<=QuizPage.TYPING_ALLOWANCE+(QuizPage.INTERVAL*7)){
            return 4;
        }else if (averageTime>QuizPage.TYPING_ALLOWANCE+(QuizPage.INTERVAL*7) && averageTime<=QuizPage.TYPING_ALLOWANCE+(QuizPage.INTERVAL*8)){
            return 3;
        }else if (averageTime>QuizPage.TYPING_ALLOWANCE+(QuizPage.INTERVAL*8) && averageTime<=QuizPage.TYPING_ALLOWANCE+(QuizPage.INTERVAL*9)){
            return 2;
        }else if (averageTime>QuizPage.TYPING_ALLOWANCE+(QuizPage.INTERVAL*9)){
            return 1;
        }
    
    }
    
    

    padHistory (input, padSize, padValue) { 
        
        let pad = [],
            newArray = [],
            newLength,
            diff = 0,
            i = 0
        
        if (Object.prototype.toString.call(input) === '[object Array]' && !isNaN(padSize)) {
            newLength = ((padSize < 0) ? (padSize * -1) : padSize)
            diff = newLength - input.length
        
            if (diff > 0) {
                for (i = 0; i < diff; i++) {
                    newArray[i] = padValue
                }
                pad = ((padSize < 0) ? newArray.concat(input) : input.concat(newArray))
            } else {
                pad = input
            }
        }
        
        return pad;
        
    }


}
