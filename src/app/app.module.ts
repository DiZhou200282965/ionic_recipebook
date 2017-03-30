/*
*  Project Name: Ionic Todo list
*  Student Name&ID: Di Zhou  200282965
*/
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { DetailsPage } from '../pages/details/details';
// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyDNELQKtsyWrcpQgzs5MzrUfmbFu7etx8E",
 authDomain: "myionicproject-68fda.firebaseapp.com",
 databaseURL: "https://myionicproject-68fda.firebaseio.com",
 storageBucket: "myionicproject-68fda.appspot.com",
 messagingSenderId: "437457262042"
};

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    DetailsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    DetailsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
