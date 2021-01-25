import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-afiliado-detail',
  templateUrl: './afiliado-detail.component.html',
  styleUrls: ['./afiliado-detail.component.scss'],
})
export class AfiliadoDetailComponent implements OnInit {
  @Input() afiliado: any;
  constructor() { }

  ngOnInit() {}

}
