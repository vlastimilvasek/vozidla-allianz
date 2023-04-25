import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { ParamsService } from '../_services/params.service';

@Component({
    selector: 'app-rekapitulace',
    templateUrl: './rekapitulace.component.html',
    styleUrls: ['./rekapitulace.component.css'],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class RekapitulaceComponent implements OnInit {
  @Input() data;
  @Input() r;
  @Input() layout;

  lists = {
    znacka: [],
    model: [],
    druh: [],
    uziti: [],
    najezd: [],
  };

  texty = {
    znacka: '',
    model: '',
    druh: '',
    uziti: '',
    najezd: '',
  };

  constructor(private paramsService: ParamsService) { }

  ngOnInit() {
    this.lists.znacka = this.paramsService.getZnacka();
    this.lists.model =  this.paramsService.getModel().filter( opt => opt.znacka === this.data.vozidlo.znacka );
    this.lists.druh = this.paramsService.getDruhVozidla();
    this.lists.uziti = this.paramsService.getUziti();
    this.lists.najezd = this.paramsService.getNajezd();   

    this.texty.znacka = this.lists.znacka[1].children.filter( v => v.value === this.data.vozidlo.znacka )[0].label;
    console.log('REKAPITULACE - onInit - texty.znacka ', this.lists.znacka[1].children.filter( v => v.value === this.data.vozidlo.znacka )[0].label);
    this.texty.model =  this.lists.model.filter( v => v.value === this.data.vozidlo.model )[0].label;
    console.log('REKAPITULACE - onInit - texty.model ', this.lists.model.filter( v => v.value === this.data.vozidlo.model )[0].label);
    // this.texty.druh = this.paramsService.getDruhVozidla();
    this.texty.uziti = this.lists.uziti.filter( v => v.value === this.data.vozidlo.uziti )[0].label;
    this.texty.najezd = this.lists.najezd.filter( v => v.value === this.data.vozidlo.najezd )[0].label;
  }

}
