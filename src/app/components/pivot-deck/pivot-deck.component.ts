import { Component, OnInit, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { DeckService, Card, Deck } from 'src/app/services/deck.service';

@Component({
    selector: 'pivot-deck',
    templateUrl: "pivot-deck.component.html",
    styleUrls: ['pivot-deck.component.scss']
})
export class PivotDeckComponent implements OnInit {


    @Input() deck: Deck;
    @Output() public onSelectChange:Subject<Card> = new Subject();
    @Output() public onFinish:Subject<Card> = new Subject();

    constructor(
        public service: DeckService
    ) {
        console.log("PivotDeckComponent.constructor()");
    }

    ngOnInit() {
        console.log("PivotDeckComponent.ngOnInit()");
    }

    _click(card:Card) {
        console.log("_click", [card]);
        // this.onSelectChange.next(this.feature);
        // this.onFinish.next(this.feature);
    }

    onCardClick(card:Card) {
        console.log("PivotDeckComponent.ngOnInit()", card);
        if (this.service.isCardSelected(card)) {
            this.service.deselectCard(card);
        } else {
            this.service.selectCard(card);
        }
        
        this.onSelectChange.next(card);
    }

}