/*
*  Project Name: Ionic Todo list
*  Student Name&ID: Di Zhou  200282965
*/
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {HomePage} from '../home/home';
@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {
// variables declarations

public recipe:any; //recipe binded recipes
public ingredient:any;
editBol:boolean=false; // boolean to decide if its Edit or Add
recipes:FirebaseListObservable<any>; // recipes that get from db

// constructor

  constructor(public navCtrl: NavController, public navParams: NavParams, af: AngularFire) {
    // if there is pram passing, get recipe object
    if (navParams.get("recipe")==undefined) {
        this.recipe = {};
        this.ingredient={};
    }
    else
    {
      this.editBol=true;
        this.recipe=navParams.get("recipe");
        this.ingredient = {};
    }
  // get recipes from firebase
    this.recipes = af.database.list('/recipes');
  }
  // event emit when save hityed
  saveRecipe(){
    if (this.editBol==true) {
          this.recipes.update(this.recipe.$key,this.recipe);
    }else{

      this.recipes.push(this.recipe);
    }
      this.navCtrl.push(HomePage); // redirect to home
  }


}
