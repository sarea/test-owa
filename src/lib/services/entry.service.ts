import { Injectable } from '@angular/core';

import { OnSendEvent } from '@@lib/services/dialog.service';


/**
 * This is a service useful only for *entry* points
 */
@Injectable()
export class EntryService {

  public onSendEvent: OnSendEvent;

  public constructor(
  ) {}

}
