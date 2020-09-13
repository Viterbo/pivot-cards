import { Component, OnInit, Input, Output, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';


const MDEO_EXTENT = [-6358249.62941, -4213839.90042, -6226491.30192, -4114146.90629 ];

interface ToiletFeature {
    get(string): any;
    getProperties(): string[];
    getId(): string;
}

@Component({
    selector: 'pivot-back-btn',
    templateUrl: "pivot-back-btn.component.html",
    styleUrls: ['pivot-back-btn.component.scss']
})
export class PivotBackBtnComponent implements OnInit, OnChanges {

    @Output() public onclick:Subject<null> = new Subject();

    constructor(
        
    ) {
        
    }
    
    ngOnInit() {
        
    }

    ngOnChanges() {
        
    }

    // _click() {
    //     this.onclick.next();
    // }

}