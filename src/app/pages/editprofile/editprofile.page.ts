import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonItem,
  IonLabel, IonAvatar } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  styleUrls: ['./editprofile.page.scss'],
  standalone: true,
  imports: [IonAvatar, 
    IonLabel,
    IonItem,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditprofilePage  {
  user = {
    username: '',
    nickname: '',
    phone: '',
    location: '',
    profileimg: 'man.png'  // Default avatar
  };

  showAvatarSlider: boolean = false;
  avatars: string[] = ['man.png', 'man (1).png','man (3).png','man (4).png','man (5).png', 'woman.png', 'woman (1).png', 'old-man.png'];
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    spaceBetween: 10
  };
  constructor(private modalController: ModalController) {}
  
  onAvatarSlideChange(event: any) {
    const currentIndex = event.target.swiper.realIndex;
    this.user.profileimg = this.avatars[currentIndex];
  }

  // Handle the selection of the avatar
  selectAvatar(avatar: string) {
    this.user.profileimg = avatar;
    this.showAvatarSlider = false; // Close the slider
    console.log('Profile image updated to: ', this.user.profileimg);
  }
  closeModal() {
    this.modalController.dismiss();
  }

  saveProfile() {
    this.modalController.dismiss(this.user); // Pass the updated user object back
  }
}
