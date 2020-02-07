import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'owa-on-send-loading',
  templateUrl: './on-send-loading.component.html',
  styleUrls: ['./on-send-loading.component.scss']
})
export class OnSendLoadingComponent implements OnInit {

  constructor(
  ) {}

  ngOnInit() {
    debugger;
  }

  public closeDialog () {
    console.log('closeDialog: ');
  }

}
