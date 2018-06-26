import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Language } from './../../models/language';
import { LanguageServiceProvider } from './../../providers/language-service/language-service';
import { LoadingController } from 'ionic-angular';
import { StartQuizPage } from './../../pages/start-quiz/start-quiz';
import { DictionaryPage } from './../../pages/dictionary/dictionary';



@IonicPage()

@Component({
	selector: 'page-language-select',
	templateUrl: 'language-select.html',
	providers: [ LanguageServiceProvider ]
})

export class LanguageSelectPage {

	public languages : Language[];
    public selectedLanguage: Language = null;
    public purpose: string = null;
    public pages: object = null;

  	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		private languageService: LanguageServiceProvider,
		public loadingCtrl: LoadingController,
	) {
        this.pages = {
            play: StartQuizPage,
            study: DictionaryPage
        };

        this.purpose = this.navParams.get('purpose');

		let loader = this.loadingCtrl.create({
			content: "Loading list of languages.. Please wait",
        });
        
        loader.present();
        
		this.languageService.getAll()
			.then((result : Language[]) => {
				this.languages = result;
				loader.dismiss();
            })

        
	}

	goTo() {
        this.navCtrl.push(this.pages[this.purpose], {
            selectedLanguage: this.selectedLanguage  
        });
		
    }
	

}
