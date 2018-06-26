import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StartQuizPage } from './start-quiz';

@NgModule({
  declarations: [
    StartQuizPage,
  ],
  imports: [
    IonicPageModule.forChild(StartQuizPage),
  ],
})
export class StartQuizPageModule {}
