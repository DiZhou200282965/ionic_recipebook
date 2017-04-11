/*
*  Project Name: Ionic Todo list
*  Student Name&ID: Di Zhou  200282965
*/
import { Component, Inject } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, ToastController, LoadingController, Loading } from 'ionic-angular';
import { AngularFire, FirebaseApp, FirebaseListObservable } from 'angularfire2';
import { Camera, File, Transfer, FilePath } from 'ionic-native';
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

  public recipe: any; //recipe binded recipes
  public ingredient: any = {};
  public disableEdit: boolean = false;
  method: string; // boolean to decide if its Edit,view or Add
  recipes: FirebaseListObservable<any>; // recipes that get from db
  loading: Loading;

  public imgUrl: string=null;
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
    }
    else if (this.method == "edit") { // if edit, enable textboxes etc.
      this.recipe = navParams.get("recipe");
    }
    else { // if view, disable edit
      this.disableEdit = true;
      this.recipe = navParams.get("recipe");
    }
    // get recipes from firebase
    this.recipes = af.database.list('/recipes');
 

    this.storageRef = firebaseApp.storage().ref()
if (this.recipe.imgName!=undefined){
  this.storageRef.child('imgs/'+this.recipe.imgName).getDownloadURL().then(url => this.imgUrl = url )
 
} 
   


 }
  // event emit when save hityed
  saveRecipe() {
    if( this.lastImage!=null){
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
    // check if there is empty string
    if (ingredient.measure == undefined || ingredient.unit == undefined || ingredient.name == undefined) {
      this.showAlert();
    }
    else {

      if (recipe.ingredient == undefined) {
        recipe.ingredient = [];
      }
      console.log(ingredient)
      recipe.ingredient.push(ingredient);
      console.log(recipe)
      this.recipes.update(recipe.$key, recipe);
    }
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'need fill',
      subTitle: 'textboxes filling required',
      buttons: ['OK']
    });
    alert.present();
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
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    Camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
        FilePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  } // end of takePicture


  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }

  }

  uploadImg() {
    var targetPath = this.pathForImage(this.lastImage);
    this.storageRef.put(targetPath).then(snapshot => {
      this.presentToast('Image succesful uploaded.');
      console.log('Uploaded a blob or file!');
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
    });
  }


}
