import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LanguageServiceProvider } from './../../providers/language-service/language-service';
import { Language } from './../../models/language';

/**
 * Generated class for the DictionaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dictionary',
  templateUrl: 'dictionary.html',
  providers: [ LanguageServiceProvider ]
})
export class DictionaryPage {

        private selectedLanguage: Language = null;
        private levels;

        constructor(
            public navCtrl: NavController, 
            private languageService: LanguageServiceProvider,
            private navParams: NavParams
        ) {
            this.selectedLanguage = this.navParams.get('selectedLanguage');
            this.languageService.getAllLevels(this.selectedLanguage.id)
                .then((result) => {
                    
                    this.levels = result;
                    console.log(this.levels)
                })
        }

        ionViewDidLoad() {
            console.log('ionViewDidLoad DictionaryPage');
        }

}
