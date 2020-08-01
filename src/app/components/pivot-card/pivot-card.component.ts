import { Component, OnInit, Input, Output, forwardRef } from '@angular/core';
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
export class PivotCardComponent extends VpeAbstractComponent implements OnInit, ResizeHandler {

    @Input() card: Card;
    @Output() public onclick:Subject<Card> = new Subject();

    constructor(
        public service: DeckService
    ) {
        super();
    }

    onResize(e: ResizeEvent) {
        //console.log("PivotCardComponent.onResize()", e);
    }

    ngOnInit() {
        
    }

    _click() {
        console.log("_click", [this.card]);
        // this.onclick.next(this.feature);
    }

}