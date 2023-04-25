import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

// Data and Service
import { ParamsService } from '../_services/params.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-adresa',
  templateUrl: './adresa.component.html',
  styleUrls: ['./adresa.component.css'],
  providers: [ ParamsService ],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class AdresaComponent implements OnInit {
    @Input() data;
    @Input() submitted;
    @Input() layout;
    @Input() prefix;

    @ViewChild(ModalDirective, { static: false }) modAdresa: ModalDirective;    
    
    lists;
    adresy;
    uzamcena = false;

    constructor(private paramsService: ParamsService) { }

    ObecOnSelect(e: TypeaheadMatch): void {
        // console.log('ObecOnSelect- Selected value: ', e);
        this.data.cast_obce_id = e.item.id;
    }

    ObecChange(obec): void {
        // console.log('ObecChange - obec: ', obec);
        // Vymazání obce => reset id
        if (!obec) { this.data.cast_obce_id = this.data.adr_id = ''; }
    }

    CPOnSelect(e: TypeaheadMatch): void {
        this.data.cp = e.item.cislo;
        this.data.psc = e.item.psc;
        this.data.obec = e.item.obec;
        this.data.adr_id = e.item.id;
        this.data.cast_obce_id = e.item.casti_obce_id;
        this.uzamcena = true;
    }

    OverAdresu(): void {
        this.paramsService.getHledej('cp', '', this.data)
        .subscribe( data => {
            console.log('OverAdresu: ', data);
            if ( data.length === 1 ) {
                this.data.cp = data[0].cislo;
                this.data.ulice = data[0].nazev_ulice;
                this.data.psc = data[0].psc;
                this.data.obec = data[0].obec;
                this.data.adr_id = data[0].id;
                this.data.cast_obce_id = data[0].casti_obce_id;
                this.uzamcena = true;
            } else if ( data.length > 1 && data.length <= 10 ) {
                // výzva k výběru ze seznamu
                if (!this.overPresnouShodu(data)) this.ukazSeznam(data);
            } else {
                // výzva k doplnění podle Mapy.cz
                if (!this.overPresnouShodu(data)) this.ukazSeznam([]);
            }
        },
            error => {
                console.log('OverAdresu - error: ', error);
            }
        );
    }

    overPresnouShodu(adresy): boolean {
        // WS vrací více variant, např. pro čp = 63  [63, 630, 631, ...]
        const adresa = adresy.filter( a => (a.cislo === this.data.cp && a.nazev_ulice === this.data.ulice && a.nazev_obce === this.data.obec && a.psc === this.data.psc));
        console.log('overPresnouShodu: ', adresa);
        if (adresa.length) {
            this.data.cp = adresa[0].cislo;
            this.data.ulice = adresa[0].nazev_ulice;
            this.data.psc = adresa[0].psc;
            this.data.obec = adresa[0].obec;
            this.data.adr_id = adresa[0].id;
            this.data.cast_obce_id = adresa[0].casti_obce_id;
            this.uzamcena = true;
            return true;
        }
        return false;
    }

    ukazSeznam(adresy): void {
        this.adresy = adresy;
        this.modAdresa.show();
    }

    VyberAdresu(adresa): void {
        this.data.cp = adresa.cislo;
        this.data.ulice = adresa.nazev_ulice;
        this.data.psc = adresa.psc;
        this.data.obec = adresa.obec;
        this.data.adr_id = adresa.id;
        this.data.cast_obce_id = adresa.casti_obce_id;
        this.adresy = [];
        this.uzamcena = true;
        this.modAdresa.hide();
    }

    ZmenAdresu(): void {
        // this.data.cp = '';
        // this.data.ulice = '';
        // this.data.psc = '';
        // this.data.obec = '';
        this.data.adr_id = '';
        this.data.cast_obce_id = '';
        this.uzamcena = false;
    }

    ngOnInit() {
        this.lists = {
            ulice: [],
            obec: [],
            cp: [],
            psc: []
        };
        this.adresy = [];
        this.uzamcena = false;

        this.lists.ulice = new Observable((observer: Observer<string>) => {
            observer.next(this.data.ulice);
        }).pipe(mergeMap((token: string) => this.paramsService.getHledej('ulice', token, this.data)));

        this.lists.cp = new Observable((observer: Observer<string>) => {
            observer.next(this.data.cp);
        }).pipe(mergeMap((token: string) => this.paramsService.getHledej('cp', token, this.data)));

        this.lists.obec = new Observable((observer: Observer<string>) => {
            observer.next(this.data.obec);
        }).pipe(mergeMap((token: string) => this.paramsService.getHledej('obec-cast', token, this.data)));

        this.lists.psc = new Observable((observer: Observer<string>) => {
            observer.next(this.data.psc);
        }).pipe(mergeMap((token: string) => this.paramsService.getHledej('psc', token, this.data)));
    }

}
