import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


// see: https://dev.office.com/reference/add-ins/outlook/1.5/Event?product=outlook&version=v1.5
export interface OnSendEvent {
  source: {
    id: any
  };
  completed: (args: { allowEvent: boolean }) => {};
}

/**
 * This is a service that can be accessed *only* by those *entry* points
 * that have access to `Office.context`
 */
@Injectable()
export class DialogService {

  // array of message ids

  private contextUi: Office.UI;
  private dialogHandler: Office.Dialog;
  private onSendEvent: OnSendEvent;
  private dialogComplete: Promise<Office.Dialog>;
  private resolveDialogComplete: (value?: Office.Dialog | PromiseLike<Office.Dialog>) => void;

  // private dialogMessageHandler = (args) => { this.messageHandler(args); }; // `this` context binding without .bind(this)
  private dialogEventHandler = (args) => { this.eventHandler(args); }; // `this` context binding without .bind(this)

  public constructor(
  ) {
    this.contextUi = Office.context.ui;
  }

  // tslint:disable-next-line:max-line-length
  public showDialog(dialogTemplate: string, width: number = 800, height: number = 600, onSendEvent?: OnSendEvent, hijackPromise?: boolean) : Promise<any> {
    return this.openDialog(dialogTemplate, width, height, true)
      .then((dialog: Office.Dialog) => {
        this.dialogHandler = dialog;
        this.onSendEvent = onSendEvent;
        dialog.addEventHandler(Office.EventType.DialogEventReceived, this.dialogEventHandler);
        // 'Hijack' promise, return a promise that resolves when the dialog is ready to send / finalise.
        // the promise resolves with the dialogHandler
        // so that entry-on-send can close the dialog JUST before completing the OnSend event.
        if (hijackPromise === true) {
          this.dialogComplete = new Promise<Office.Dialog>((resolve) => {
            this.resolveDialogComplete = resolve;
          });
        }
        // close the dialog after 5 min due to microsoft's bug!
        setTimeout(() => {
          this.dialogHandler.close();
          if (this.onSendEvent) {
            this.onSendEvent.completed({ allowEvent: false });
          }
        }, 1000 * 60 * 5 * 0.98);

        if (hijackPromise === true) {
          return this.dialogComplete;
        }
        return;
      })
      .catch(error => { // opening dialog cancelled.
        console.log( `Error showing dialog`, { error , dialogTemplate });
      });
  }

  public openDialog(dialog: string, width: number, height: number, displayInIframe: boolean = true) : Promise<Office.Dialog> {
    return new Promise((resolve, reject) => {
      const optimalSize = this.getOptimalDialogSize(width, height);
      const dialogUrl = `${environment.OWA_URL}/index.html#${dialog}`;
      this.contextUi.displayDialogAsync(dialogUrl, {
        width: optimalSize.width,
        height: optimalSize.height,
        displayInIframe
      }, (result: Office.AsyncResult<Office.Dialog>) => {
        if (result.status === Office.AsyncResultStatus.Failed || result.error !== undefined) {
          this.dialogErrorHandler(result, dialog);
          return reject(result.error);
        }
        return result.value !== undefined
          ? resolve(result.value)
          : reject('Opening dialog resulted in either no `result.value` nor a success status');
      });
    });
  }

  public handleOnSendError(onSendEvent: OnSendEvent) {
    console.log('error: handleOnSendError');
  }

  private getOptimalDialogSize(minWidthPx: number, minHeightPx: number) : { width: number, height: number } {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    // suppose minWidthPx = 640px, then:
    // res(px):   400   640     1280    1560  etc.
    // perc:      100%  100%    50%     25%   etc.
    const minCalcWidth = (minWidthPx / screenWidth) * 100;
    const minCalcHeight = (minHeightPx / screenHeight) * 100;
    const optimalWidthPerc = Math.min((screenWidth / minWidthPx) * 100, minCalcWidth);
    const optimalHeightPerc = Math.min((screenHeight / minHeightPx) * 100, minCalcHeight);

    return {width: optimalWidthPerc, height: optimalHeightPerc};
  }

  public eventHandler(ev: any) {
    console.log('ev.error: ', ev.error);
  }

  private dialogErrorHandler(result, dialog) {
    console.log('dialog: ', dialog);
    console.log('result.error.code: ', result.error.code);
  }
}
