import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Globals } from './globals'
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LanguageSelectPageModule } from '../pages/language-select/language-select.module';
import { StartQuizPageModule } from '../pages/start-quiz/start-quiz.module';
import { QuizPageModule } from '../pages/quiz/quiz.module';
import { DictionaryPageModule } from '../pages/dictionary/dictionary.module';



@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    LanguageSelectPageModule,
    StartQuizPageModule,
    QuizPageModule,
    DictionaryPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Globals,
    HttpClientModule,
  ]
})
export class AppModule {}
