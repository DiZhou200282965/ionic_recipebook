import { Component,ViewChild } from '@angular/core';
import { Platform,Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import { FavoritePage } from '../pages/favorite/favorite';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';


// import { StatusBar } from '@ionic-native/status-bar';
// import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  pages: Array<{title: string, component: any}>;
  rootPage = HomePage;

  constructor(platform: Platform
  ) {

        platform.ready().then(() => {
             // Okay, so the platform is ready and our plugins are available.
             // Here you can do any higher level native things you might need.
             StatusBar.styleDefault();
             Splashscreen.hide();
           });
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Favorite', component: FavoritePage },
      {title: 'About', component: AboutPage },
      { title: 'Contact', component: ContactPage }
    ];
}


 openPage(page) {
   // Reset the content nav to have just this page
   // we wouldn't want the back button to show in this scenario
   this.nav.setRoot(page.component);
 }
}
