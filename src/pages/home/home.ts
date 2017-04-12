
/*
*  Project Name: Ionic Todo list
*  Student Name&ID: Di Zhou  200282965
*/


import { Component,Inject } from '@angular/core';
import {AngularFire,FirebaseApp, FirebaseListObservable} from 'angularfire2';
import{DetailsPage} from '../details/details';
import { NavController, AlertController } from 'ionic-angular';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
// variables declarations
public  recipes:FirebaseListObservable<any>

  storageRef: any;
// constructor
  constructor( @Inject(FirebaseApp) firebaseApp: firebase.app.App,public navCtrl: NavController,public alertCtrl: AlertController,  af: AngularFire) {

    this.recipes = af.database.list('/recipes'); // get recipes list from db
    


 this.storageRef = firebaseApp.storage().ref()
  }

  // function add recipe
  addRecipe(){
    this.navCtrl.push(DetailsPage,{method:"add"}); // redirect to detail page
  }
  // function edit recipes
  editRecipe(recipe){
    this.navCtrl.push(DetailsPage,{recipe:recipe,method:"edit"}); // redirect to detail page with prameter
  }
  // function delete recipe
  deleteRecipe(recipe){
    this.recipes.remove(recipe); // delete selected recipe from db
  }
  detailRecipe(recipe){
      this.navCtrl.push(DetailsPage,{recipe:recipe,method:"view"});
  }
addToFavorite(recipe){
  recipe.favorite = true;
  this.recipes.update(recipe.$key,recipe);
}
removeFav(recipe){
recipe.favorite = false;
  this.recipes.update(recipe.$key,recipe);
}
getImgUrl(recipe){

  this.storageRef.child('imgs/'+recipe.imgName).getDownloadURL().then(url =>{return url;} )
}

}
