import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class PrincipalComponent implements OnInit {
  error: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
