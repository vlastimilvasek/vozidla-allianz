import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { catchError, map, tap } from 'rxjs/operators';
import { ISrovnani, ISelectItem, ISjednaniResp } from '../_interfaces/vozidla';
import { DRUH, PALIVO, UZITI, OSOBY, NAJEZD } from '../../assets/params/zakladni_nabidky';
import { ZNACKA, MODEL } from '../../assets/params/znacka_model';
import { Observable } from 'rxjs';

@Injectable()
export class ParamsService {

    constructor(private http: HttpClient) { }

    getOsoby() {
        // return this.http.get<ISelectItem[]>('assets/params/osoby.json');
        return OSOBY;
    }

    getDruhVozidla() {
        return DRUH;
    }

    getPalivo() {
        return PALIVO;
    }
    getUziti() {
        return UZITI;
    }
    getNajezd() {
        return NAJEZD;
    }
    getZnacka() {
        return ZNACKA;
    }

    getModel() {
        return MODEL;
    }

    getNewId() {
        return this.http.get('https://www.srovnavac.eu/api/vozidla/app/noveid')
        .pipe(
            // catchError()
        );
    }

    getKalkulace(id) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };
        const data = {'id': id};
        // console.log('PARAMS.SERVICE getKalkulace - id ', data);
        return this.http.post('https://www.srovnavac.eu/api/vozidla/app/kalkulace', data, httpOptions)
        .pipe(
            // map(resp => { console.log('PARAMS.SERVICE - getKalkulace ', resp ); resp = this.cast(resp, CVozidla); console.log('PARAMS.SERVICE - getKalkulace po zprac ', resp ); })
            // catchError()
        );
    }

    KalkulaceEmail(data) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };
        return this.http.post('https://www.srovnavac.eu/api/vozidla/app/emailkalk', data, httpOptions)
        .pipe(
            // catchError()
        );
    }

    getPartnerKalkulace(partner, data) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        console.log('ParamsService - PartnerKalkulace -  https://www.srovnavac.eu/api/vozidla/' + partner + '/kalkulace');
        console.log('s daty');
        console.log( JSON.stringify(data) );
        return this.http.post<any>('https://www.srovnavac.eu/api/vozidla/' + partner + '/kalkulace', data, httpOptions)
            .pipe(
                // map( (data) => console.log('PARAMS.SERVICE - getSrovnani ', data ) )
                // catchError()
            );
    }

    getPartnerNabidka(partner, data) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        console.log('ParamsService - PartnerNabidka -  https://www.srovnavac.eu/api/vozidla/' + partner + '/nabidka');
        console.log('s daty');
        console.log( JSON.stringify(data) );
        return this.http.post<any>('https://www.srovnavac.eu/api/vozidla/' + partner + '/nabidka', data, httpOptions)
            .pipe(
                // map( (data) => console.log('PARAMS.SERVICE - getSrovnani ', data ) )
                // catchError()
            );
    }    

    ulozKalkulaci(data) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };
        // console.log(JSON.stringify(data));
        return this.http.post<ISjednaniResp>('https://www.srovnavac.eu/api/vozidla/app/ulozkalkulaci', data, httpOptions);
    }

    getSrovnani(data) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };
        console.log('Volání -  https://www.srovnavac.eu/api/vozidla/app/srovnani');
        console.log('s daty');
        console.log( JSON.stringify(data) );
        return this.http.post<ISrovnani>('https://www.srovnavac.eu/api/vozidla/app/srovnani', data, httpOptions)
        .pipe(
            // map( (data) => console.log('PARAMS.SERVICE - getSrovnani ', data ) )
            // catchError()
        );
    }

    ulozSjednani(data) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };
        console.log('Volání -  https://www.srovnavac.eu/api/vozidla/app/sjednani');
        console.log('s daty');
        console.log( JSON.stringify(data) );        
        return this.http.post<ISjednaniResp>('https://www.srovnavac.eu/api/vozidla/app/sjednani', data, httpOptions);
    }

    /**
     * Nová verze doplňování adres - komponenta adresa
     * @param  {String} co hledany parametr adresy [ulice, cp, psc, obec]
     * @param  {String} token retezec naseptavace
     * @param  {Object} data objekt s udaji adresy
     * @return {Observable[]}  vrací pole s objekty adres
     */    
    getHledej(co, token, data)  {
        // console.log('https://www.srovnavac.eu/ruian/hledej?q=' + co + '&coid=' + data.cast_obce_id
        //     + '&psc=' + data.psc + '&cp=' + data.cp + '&ulice=' + data.ulice + '&obec=' + data.obec);
        let cp = data.cp.split("/");
        if (cp.length > 1) cp = cp[0];
        return this.http.get<any[]>('https://www.srovnavac.eu/ruian/hledej?q=' + co
             + '&coid=' + (data.cast_obce_id ? data.cast_obce_id : '')
             + '&psc=' + (data.psc ? data.psc : '')
             + '&cp=' + (cp ? cp : '')
             + '&ulice='+ (data.ulice ? data.ulice : '')
             + '&obec=' + (data.obec ? data.obec : '')
            );
    }
}
