
/*
*  Project Name: Ionic Todo list
*  Student Name&ID: Di Zhou  200282965
*/


import { Component } from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import{DetailsPage} from '../details/details';
import { NavController, AlertController } from 'ionic-angular';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
// variables declarations
public  recipes:FirebaseListObservable<any>
public  myDate :any = new Date();

// constructor
  constructor(public navCtrl: NavController,public alertCtrl: AlertController,  af: AngularFire) {
    this.recipes = af.database.list('/recipes'); // get recipes list from db
  }
  // function add recipe
  addRecipe(){
    this.navCtrl.push(DetailsPage); // redirect to detail page
  }
  // function edit recipes
  editRecipe(recipe){
    this.navCtrl.push(DetailsPage,{recipe:recipe}); // redirect to detail page with prameter
  }
  // function delete recipe
  deleteRecipe(recipe){
    this.recipes.remove(recipe); // delete selected recipe from db
  }



}
