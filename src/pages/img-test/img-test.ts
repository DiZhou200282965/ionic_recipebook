import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { NavParams,NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { Camera, File, Transfer, FilePath } from 'ionic-native';
import {FirebaseApp} from 'angularfire2';
import * as firebase from 'firebase';

declare var cordova: any;
/*
  Generated class for the ImgTest page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-img-test',
  templateUrl: 'img-test.html'
})
export class ImgTestPage {


  lastImage: string = null;
    loading: Loading;
    public image: string;
  constructor(
    @Inject(FirebaseApp) firebaseApp: firebase.app.App,
  public navCtrl: NavController,
     public actionSheetCtrl: ActionSheetController,
      public toastCtrl: ToastController,
      public platform: Platform,
      public loadingCtrl: LoadingController)

      {
        const storageRef = firebaseApp.storage().ref().child('528418.jpg');
           storageRef.getDownloadURL().then(url=>
              this.image = url
            )

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
  newFileName =  n + ".jpg";
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



public uploadImage() {














  
  // Destination URL
  var url = "https://myionicproject-68fda.firebaseio.com";

  // File for Upload
  var targetPath = this.pathForImage(this.lastImage);

  // File name only
  var filename = this.lastImage;

  var options = {
    fileKey: "file",
    fileName: filename,
    chunkedMode: false,
    mimeType: "multipart/form-data",
    params : {'fileName': filename}
  };

  const fileTransfer = new Transfer();

  this.loading = this.loadingCtrl.create({
    content: 'Uploading...',
  });
  this.loading.present();

  // Use the FileTransfer to upload the image
  fileTransfer.upload(targetPath, url, options).then(data => {
    this.loading.dismissAll()
    this.presentToast('Image succesful uploaded.');
  }, err => {
    this.loading.dismissAll()
    this.presentToast('Error while uploading file.');
  });
}

}
