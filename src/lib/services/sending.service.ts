import { Injectable } from '@angular/core';

import {
    OnSendEvent
} from '@@lib/services';


@Injectable()
export class SendingService {

  private itemLs: any;

  constructor(
  ) {}

  public send (itemId: string, onSendEvent: OnSendEvent, dialogHandler: Office.Dialog) {

  }


  public sendOwaItem (draft, onSendEvent: OnSendEvent, dialogHandler?: Office.Dialog) : void {
    this.closeOnSendEvent(onSendEvent, dialogHandler);
  }

  private closeOnSendEvent (onSendEvent: OnSendEvent, dialogHandler?: Office.Dialog) : void {
    if (dialogHandler !== undefined) {
      dialogHandler.close();
    }
    onSendEvent.completed({ allowEvent: true }); // sends + closes OWA draft
  }

}
