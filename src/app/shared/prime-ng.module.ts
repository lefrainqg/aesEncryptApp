import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';

@NgModule({
  exports: [
    ButtonModule,
    TabViewModule,
    ToolbarModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    FileUploadModule,
    HttpClientModule,
    InputTextareaModule,
    PasswordModule,
  ],
})
export class PrimeNgModule {}
