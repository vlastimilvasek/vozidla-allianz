import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

// Data and Service
import { ParamsService } from '../_services/params.service';

@Component({
    selector: 'app-osoba',
    templateUrl: './osoba.component.html',
    styleUrls: ['./osoba.component.css'],
    providers: [ ParamsService ],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class OsobaComponent implements OnInit {
    @Input() data;
    @Input() submitted;
    @Input() layout;
    @Input() role;    
    lists = {
        osoba: [],
    };

    constructor(private paramsService: ParamsService) { }

    ngOnInit() {
        this.lists.osoba = this.paramsService.getOsoby();
        // console.log('OSOBA - init - role: ', this.role);
        // console.log('OSOBA - init - data: ', this.data);
    }

}
