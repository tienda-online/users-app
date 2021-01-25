import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
})
export class NoDataComponent implements OnInit {

  @Input() icon = 'sad';
  @Input() title = 'No existen datos registrados';
  constructor() { }

  ngOnInit() {}

}
