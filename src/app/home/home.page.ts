import { Component } from '@angular/core';
import { PickerController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(public pickerCtrl: PickerController){
    this.openPicker();
  }

  async openPicker() {
    const picker = await this.pickerCtrl.create({
      buttons: [{
        text: 'Done',
      }],
      columns: [
        {
          name: 'days',
          options: [
            {
              text: '1',
              value: 1
            },
            {
              text: '2',
              value: 2
            },
            {
              text: '3',
              value: 3
            },
          ]
        },
        {
          name: 'years',
          options: [
            {
              text: '1992',
              value: 1992
            },
            {
              text: '1993',
              value: 1993
            },
            {
              text: '1994',
              value: 1994
            },
          ]
        },
      ]
    });
    await picker.present();
  }

}
