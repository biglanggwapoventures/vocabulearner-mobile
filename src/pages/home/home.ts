import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LanguageSelectPage } from './../language-select/language-select';
import { DictionaryPage } from './../dictionary/dictionary';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  selectLanguage (purpose: string) {
    this.navCtrl.push(LanguageSelectPage, {
        purpose: purpose
    });
  }

}
