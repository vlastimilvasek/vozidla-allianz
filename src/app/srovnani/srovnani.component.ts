import { Component, OnInit, Input, ViewChild, Output, EventEmitter, TemplateRef} from '@angular/core';
import { trigger, transition, style, animate, keyframes, query, stagger, animateChild } from '@angular/animations';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ParamsService } from '../_services/params.service';
import { LOGO_200x100 } from '../../assets/params/loga';
import { PARTNERI } from '../../assets/params/partneri';

@Component({
    selector: 'app-srovnani',
    templateUrl: './srovnani.component.html',
    styleUrls: ['./srovnani.component.css'],
    animations: [
        trigger('items', [
          transition('void => *', [
            animate(300, keyframes([
              style({opacity: 0, transform: 'translateX(100%)', offset: 0}),
              style({opacity: 1, transform: 'translateX(15px)', offset: 0.2}),
              style({opacity: 1, transform: 'translateX(0)', offset: 0.8})
            ]))
          ]),
          transition('* => void', [
            animate(300, keyframes([
              style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
              style({opacity: 1, transform: 'translateX(-15px)', offset: 0.6}),
              style({opacity: 0, transform: 'translateX(100%)',  offset: 0.8})
            ]))
          ]),
        ]),
        trigger('list', [
          transition(':enter', [
            query('@items', stagger(150, animateChild()), { optional: true })
          ]),
        ])
    ]
})
export class SrovnaniComponent implements OnInit {
    @Input() offers;
    @Input() data;
    @Input() layout;
    @Output() vyberProdukt = new EventEmitter<number>();
    LOGA = LOGO_200x100;
    partneri = PARTNERI;    

    platby = [];
    nabModal = {
      loaded: false,
      status: false,
      docs: [] 
    };
    modalRef: BsModalRef;

    constructor(private modalService: BsModalService, private paramsService: ParamsService) { }

    stahniNabidku(template: TemplateRef<any>, produkt: any) {
      const offer = this.offers.find(k => k.id === produkt);
      const partner = Object.keys(this.partneri).find(k => this.partneri[k].nazev === offer.pojistovna);
      if ( partner ) {
        this.nabModal.loaded = false;
        this.modalRef = this.modalService.show(template);
        const data = Object.assign({}, this.data);
        data.produkt = produkt;
        this.paramsService.getPartnerNabidka(partner, data)
        .subscribe( nabidka => {
            console.log('nabidka - resp: ', nabidka);
            if ( nabidka && nabidka.status && nabidka.docs.length ) {
              this.nabModal.loaded = true;
              this.nabModal.status = true;
              this.nabModal.docs = nabidka.docs;
              console.log('nabidka - resp OK: ', this.nabModal);
            } else {
              this.nabModal.loaded = true;
              console.log('nabidka - resp OK: ', this.nabModal);
            }
        },
            error => {
                console.log('nabidka - error: ', error);
                this.nabModal.loaded = true;
            }
        );
      }

    }

    ngOnInit() {
      this.platby = [1, 2, 4];
      this.nabModal.loaded = false;
    }

}
