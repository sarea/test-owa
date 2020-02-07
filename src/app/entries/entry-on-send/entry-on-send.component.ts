import { Component, OnInit } from '@angular/core';

import {
    DialogService,
    EntryService,
    OnSendEvent,
} from '../../../lib/services';
import { SendingService } from '../../../lib/services/sending.service';

declare var onItemSend: Function; // var is declared in <head>

@Component({
  selector: 'owa-entry-on-send',
  templateUrl: './entry-on-send.component.html',
  styleUrls: ['./entry-on-send.component.scss']
})
export class EntryOnSendComponent implements OnInit {

  private onSendEvent: OnSendEvent;
  public isRightPaneRunning: boolean = undefined;

  // tslint:disable-next-line:parameters-max-number
  constructor(
    private dialogService: DialogService,
    private entryService: EntryService,
    private sendingService: SendingService,
  ) { }

  public ngOnInit() {
    onItemSend = (event: OnSendEvent) => {
      this.onSendEvent = event;
      this.entryService.onSendEvent = event;
      this.showOnSendDialog('whatever');
    };
  }


  private showOnSendDialog(restItemId: string, retries: number = 0) : Promise<void | number> {
    const encItemId = encodeURIComponent(restItemId);
    return Promise.all([
      this.dialogService.showDialog(`/on-send-loading/${encItemId}`, 1000, 600, this.onSendEvent, true),
      Promise.resolve(restItemId)
    ])
    .then((dialogHandlerAndItemId: [Office.Dialog, string]) => {
      const [dialogHandler, itemId] = dialogHandlerAndItemId;
      return this.sendingService.send(itemId, this.onSendEvent, dialogHandler);
    })
    .catch((error) => {
      // retry up to 3 times..
      if (retries < 3) {
        return window.setTimeout(() => { this.showOnSendDialog(restItemId, retries + 1); }, 500);
      }
      // otherwise, just fail.
      this.dialogService.handleOnSendError(this.onSendEvent);
    });
  }


}
