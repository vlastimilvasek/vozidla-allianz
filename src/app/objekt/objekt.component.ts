import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';

// Data and Service
import { ParamsService } from '../_services/params.service';

@Component({
  selector: 'app-objekt',
  templateUrl: './objekt.component.html',
  styleUrls: ['./objekt.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class ObjektComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() submitted;
  @Input() layout;  

  rzChecked = true;
  vtpChecked = true;

  lists = {
    znacka: [],
    model: [],
    druh: [],
    rok_vyroby: [],
    palivo: [],
    uziti: [],
    najezd: []
  };

  locale = 'cs';
  bsConfig: Partial<BsDatepickerConfig>;
  minDate: Date;
  maxDate: Date;    

  constructor(
    private paramsService: ParamsService,    
    private localeService: BsLocaleService
  ) {}

  ngOnInit() {
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: 'theme-default', adaptivePosition: false, dateInputFormat: 'D.M.YYYY' });
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 365*100);
    this.maxDate.setDate(this.maxDate.getDate() + 30);      
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
        if (changes.hasOwnProperty(propName)) {
            const change = changes[propName];
            console.log('ZADANI ngOnChanges ', propName);
            switch (propName) {
                case 'data': {
                    this.nastavSeznamy();
                    console.log('OBJECT - ngOnChanges data ', this.data);
                    if (change.previousValue != change.currentValue) {
                        // console.log('puvodni ', JSON.stringify(change.previousValue));
                        // console.log('nova ', JSON.stringify(change.previousValue));
                    }


                    break;

                }
                case 'parentForm': {

                    break;
                }
            }
        }
    }
  }

  zmenaRZ(evt): void {
    this.rzChecked = evt.target.checked;
    if (!this.rzChecked) {
      this.data.vozidlo.rz = null;
    }
  }

  zmenaVTP(evt): void {
    this.vtpChecked = evt.target.checked;
    if (!this.vtpChecked) {
      this.data.vozidlo.vtp = null;
    }
  }

  nastavSeznamy(): void {
    this.lists.druh = this.paramsService.getDruhVozidla();
    this.lists.znacka = this.paramsService.getZnacka();
    this.lists.palivo = this.paramsService.getPalivo();
    this.lists.uziti = this.paramsService.getUziti();
    this.lists.najezd = this.paramsService.getNajezd();
    this.modelList();
  }

  modelList( change: boolean = false ): void {
    if (change) { this.data.vozidlo.typ = ''; }
    if (this.data.vozidlo.znacka) {
        const options = [];
        const modely = this.paramsService.getModel().filter( opt => opt.znacka === this.data.vozidlo.znacka );
        // console.log(modely);
        modely.forEach( opt => {
            options.push( {
                label: opt.label,
                value: opt.value
            });
        });
        if (modely.length === 1) { this.data.vozidlo.typ = modely[0].value; }
        this.lists.model = options;
    }
  }

}
