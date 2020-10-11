import { Component, OnInit, Input, Output, forwardRef, OnChanges, HostBinding, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DeckService, Card } from 'src/app/services/deck.service';
import { VpeAbstractComponent } from '../vpe-components.service';
import { ResizeHandler, ResizeEvent } from '../vpe-resize-detector.directive';

@Component({
    selector: 'pivot-header',
    templateUrl: "pivot-header.component.html",
    styleUrls: ['pivot-header.component.scss'],
    providers: [
        {provide: VpeAbstractComponent, useExisting: forwardRef(() => PivotHeaderComponent)}
    ]
})
export class PivotHeaderComponent extends VpeAbstractComponent implements ResizeHandler {

    @Input() public delegate:boolean;
    @Output() public ondinamica:Subject<number> = new Subject();
    constructor(
        public service: DeckService,
        public elem: ElementRef,
        public router: Router,
    ) {
        super();
    }

    onResize(e: ResizeEvent) {
        //console.log("PivotHeaderComponent.onResize()", e);
    }

    gotoCartas() {
        return this.router.navigate(['/cartas']); 
    }
    
    onDinamica(num:number) {
        // console.log("PivotHeaderComponent.onDinamica()", [num]);
        this.service.resetCanvas();
        this.service.resetSelection();
        if (this.delegate) {
            this.ondinamica.next(num);
        } else {
            this.onDinamicaSimple(num);
        }
    }

    onDinamicaSimple(dinamica:number) {
        switch(dinamica){
            case 1: return this.router.navigate(['/selection']); 
            case 2: return this.router.navigate(['/filter']); 
            case 3: return this.router.navigate(['/slots']); 
        }
    }

}