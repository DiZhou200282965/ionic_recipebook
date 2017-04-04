/*
*  Project Name: Ionic Todo list
*  Student Name&ID: Di Zhou  200282965
*/
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {HomePage} from '../home/home';
import { AlertController } from 'ionic-angular';
@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {
// variables declarations

public recipe:any; //recipe binded recipes
public ingredient:any={};
public disableEdit:boolean=false;
method:string; // boolean to decide if its Edit,view or Add
recipes:FirebaseListObservable<any>; // recipes that get from db

// constructor

  constructor(public navCtrl: NavController, public navParams: NavParams, af: AngularFire,public alertCtrl: AlertController) {
  this.method = navParams.get("method");
  console.log(this.method)
    // if there is pram passing, get recipe object
    if (this.method=="add") { // if add  init empty obj
        this.recipe = {};
    }
    else if(this.method =="edit") { // if edit, enable textboxes etc.
        this.recipe=navParams.get("recipe");
    }
    else{ // if view, disable edit
      this.disableEdit = true;
      this.recipe=navParams.get("recipe");
    }
  // get recipes from firebase
    this.recipes = af.database.list('/recipes');
  }
  // event emit when save hityed
  saveRecipe(){
    console.log(this.method)
    if (this.method=="edit") {
          this.recipes.update(this.recipe.$key,this.recipe);
    }else if(this.method=="add"){
      this.recipes.push(this.recipe);
    }
      this.navCtrl.push(HomePage); // redirect to home
  }
addIngredient(ingredient,recipe){
  // check if there is empty string
  if (ingredient.measure==undefined||ingredient.unit==undefined||ingredient.name==undefined) {
    this.showAlert();
  }
  // else{
  //   if (recipe.ingredient==undefined) {
  //       recipe.ingredient=[];
  //   }
  //   recipe.ingredient.push(ingredient);
  //   this.recipes.update(recipe.$key,recipe);
  // }
}

showAlert() {
  let alert = this.alertCtrl.create({
    title: 'need fill',
    subTitle: 'textboxes filling required',
    buttons: ['OK']
  });
  alert.present();
}

}
