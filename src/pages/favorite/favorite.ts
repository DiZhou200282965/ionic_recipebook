import { Component } from '@angular/core';
import{DetailsPage} from '../details/details';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
/*
  Generated class for the Favorite page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-favorite',
  templateUrl: 'favorite.html'
})
export class FavoritePage {
public  recipes:FirebaseListObservable<any>
  constructor(public navCtrl: NavController, public navParams: NavParams, af: AngularFire) {
      this.recipes = af.database.list('/recipes'); // get recipes list from db
  }
  detailRecipe(recipe){
      this.navCtrl.push(DetailsPage,{recipe:recipe,method:"view"});
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritePage');
  }
  removeFav(recipe){
  recipe.favorite = false;
    this.recipes.update(recipe.$key,recipe);
  }

}
