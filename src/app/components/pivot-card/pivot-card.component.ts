import { Component, OnInit, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { DeckService, Card } from 'src/app/services/deck.service';

@Component({
    selector: 'pivot-card',
    templateUrl: "pivot-card.component.html",
    styleUrls: ['pivot-card.component.scss']
})
export class PivotCardComponent implements OnInit {

    @Input() card: Card;
    @Output() public onclick:Subject<Card> = new Subject();

    constructor(
        public service: DeckService
    ) {
        
    }

    ngOnInit() {
        
    }

    _click() {
        console.log("_click", [this.card]);
        // this.onclick.next(this.feature);
    }

}