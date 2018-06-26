import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading } from 'ionic-angular';
import { Language } from './../../models/language';
import { Character } from './../../models/character';
import { LanguageServiceProvider } from './../../providers/language-service/language-service';
import { LoadingController } from 'ionic-angular';
import { QuizPage } from './../quiz/quiz'; 

@IonicPage()
@Component({
  selector: 'page-start-quiz',
  templateUrl: 'start-quiz.html',
  providers: [LanguageServiceProvider]
})
export class StartQuizPage {

    public selectedLanguage: Language;
    public characters: Character[];

    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams, 
        private languageService: LanguageServiceProvider,
        private loadingCtrl: LoadingController
    ) {
        this.loadCharacters();  
    }

    startQuiz () {
        this.navCtrl.push(QuizPage, {
            selectedLanguage: this.selectedLanguage,
            characters: this.characters
        });
    }

    loadCharacters () {
        this.selectedLanguage = this.navParams.get('selectedLanguage');
        let loader = this.loadingCtrl.create({
			content: "Loading characters... Please wait",
		});
		loader.present();
		this.languageService.getCharacters(this.selectedLanguage.id)
			.then((result: Character[]) => {
				this.characters = result;
                loader.dismiss();
                this.startQuiz();
			})
    } 
}
