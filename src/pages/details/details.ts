/*
*  Project Name: Ionic Todo list
*  Student Name&ID: Di Zhou  200282965
*/
import { Component, Inject } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, ToastController, LoadingController, Loading } from 'ionic-angular';
import { AngularFire, FirebaseApp, FirebaseListObservable } from 'angularfire2';
import { Camera } from 'ionic-native';
import { HomePage } from '../home/home';
import { AlertController } from 'ionic-angular';
import * as firebase from 'firebase';

declare var cordova: any;

@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {
  // variables declarations
  public realtimeRecipe: any;
  public recipe: any; //recipe binded recipes
  public ingredient: any = {};
  public disableEdit: boolean = false;
  method: string; // boolean to decide if its Edit,view or Add
  recipes: FirebaseListObservable<any>; // recipes that get from db
  loading: Loading;

  public imgUrl: string = null;
  lastImage: string = null;
  storageRef: any;
  // constructor

  constructor(
    @Inject(FirebaseApp) firebaseApp: firebase.app.App,
    public navCtrl: NavController,
    public navParams: NavParams,
    af: AngularFire,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {

    this.method = navParams.get("method");

    // if there is pram passing, get recipe object
    if (this.method == "add") { // if add  init empty obj
      this.recipe = {};
      this.recipe.ingredient=[];
    }
    else if (this.method == "edit") { // if edit, enable textboxes etc.
      this.recipe = navParams.get("recipe");
      this.imgUrl = this.recipe.imgName;
    }
    else { // if view, disable edit
      this.disableEdit = true;
      this.recipe = navParams.get("recipe");
      this.imgUrl = this.recipe.imgName;
    }
    // get recipes from firebase
    this.recipes = af.database.list('/recipes');

    // loop through recipes, and get recipe instance by Id


    // this.recipes.subscribe(items => {
    //   // items is an array
    //   items.forEach(item => {
    //     // console.log('Item:', item.$key);
    //     if (item.$key === this.recipe.$key) {
    //       console.log('Item:', item);
    //       this.realtimeRecipe = item;
    //     }
    //   });
    // })


    this.storageRef = firebaseApp.storage().ref()
    // if (this.recipe.imgName != undefined) {
    //   this.storageRef.child('imgs/' + this.recipe.imgName).getDownloadURL().then(url => this.imgUrl = url)

    // }



  }
  // event emit when save hityed
  saveRecipe() {
    if (this.lastImage != null) {
      this.recipe.imgName = this.lastImage;
    }
    console.log(this.method)
    if (this.method == "edit") {
      this.recipes.update(this.recipe.$key, this.recipe);
    } else if (this.method == "add") {
      this.recipes.push(this.recipe);
    }
    this.navCtrl.push(HomePage); // redirect to home
  }
  addIngredient(ingredient, recipe) {
 recipe.ingredient.push(ingredient);
  if(this.method === "edit"){

 this.recipes.update(recipe.$key, recipe);
  }
     

   
    
  }
deleteIngredient(ingredient,recipe){
      
 recipe.ingredient.forEach((ingred,index)=>{
  if(ingred.name === ingredient.name&&ingred.measure === ingredient.measure&&ingred.unit === ingredient.unit){
    recipe.ingredient.splice(index,1);
    this.recipes.update(recipe.$key, recipe);
  }  

 })
 
}
 
  popupAddingView(recipe){
      let prompt = this.alertCtrl.create({
      title: 'Add a ingredient',
      message: "Please enter ingredient's name,measure and unit.",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        },
        {
          name: 'measure',
          placeholder: 'Measure'
        },
        {
          name: 'unit',
          placeholder: 'Unit'
        }
       
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {

   this.addIngredient(data, recipe)
    }            
        }
      ]
    }); 
  
    
    prompt.present();
  }
  
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  } // end of presentActionSheet


  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 85,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      targetWidth: 500,
      targetHeight: 500,
      allowEdit: true,
      encodingType: Camera.EncodingType.PNG
      // ,saveToPhotoAlbum: true
    };

    // Get the data of an image
    Camera.getPicture(options).then((imgData) => {
      // upload img
      this.uploadImg(imgData);
    }, (err) => {
      this.presentToast('Error while selecting image. ' + JSON.stringify(err));
    });
  } // end of takePicture

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".png";
    return newFileName;
  }
  uploadImg(imgData) {
    var tempName = this.createFileName();
    this.storageRef.child('imgs/' + tempName).putString(imgData, 'base64', { contentType: 'image/png' }).then((snapshot) => {
      // this.recipe.imgName=tempName;
      // this.recipes.update(this.recipe.$key, this.recipe)
      // this.storageRef.child('imgs/' + this.recipe.imgName).getDownloadURL().then(url => this.imgUrl = url)

      this.storageRef.child('imgs/' + tempName).getDownloadURL().then(url => {
        this.imgUrl = url
        this.recipe.imgName = url;
        this.recipes.update(this.recipe.$key, this.recipe)
      })

      this.presentToast('Image succesful uploaded.');
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
    });

  }





}
