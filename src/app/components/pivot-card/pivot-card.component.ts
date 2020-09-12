import { Component, OnInit, Input, Output, forwardRef, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { DeckService, Card } from 'src/app/services/deck.service';
import { VpeAbstractComponent } from '../vpe-components.service';
import { ResizeHandler, ResizeEvent } from '../vpe-resize-detector.directive';

@Component({
    selector: 'pivot-card',
    templateUrl: "pivot-card.component.html",
    styleUrls: ['pivot-card.component.scss'],
    providers: [
        {provide: VpeAbstractComponent, useExisting: forwardRef(() => PivotCardComponent)}
    ]
})
export class PivotCardComponent extends VpeAbstractComponent implements OnInit, OnChanges, ResizeHandler {

    @Input() card: Card;
    @Input() description: boolean;
    @Output() public onclick:Subject<Card> = new Subject();
    show_desc: boolean;
    
    constructor(
        public service: DeckService
    ) {
        super();
        this.show_desc = true;
        if (this.description == false) {
            this.show_desc = false;
        }
        // console.log("this.description", this.description);
    }

    get color() {
        if (this.card) return this.card.color; 
        return "default";
    }

    onResize(e: ResizeEvent) {
        //console.log("PivotCardComponent.onResize()", e);
    }

    ngOnChanges() {
        if (this.description == false) {
            this.show_desc = false;
        }
    }

    ngOnInit() {
        
    }

    _click() {
        console.log("PivotCardComponent._click()", [this.card]);
        this.onclick.next(this.card);
    }

}