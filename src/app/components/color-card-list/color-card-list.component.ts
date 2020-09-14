import { Component, OnInit, Input, Output, forwardRef, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { DeckService, Card, Deck } from 'src/app/services/deck.service';
import { VpeAbstractComponent } from '../vpe-components.service';
import { ResizeHandler, ResizeEvent } from '../vpe-resize-detector.directive';

@Component({
    selector: 'color-card-list',
    templateUrl: 'color-card-list.component.html',
    styleUrls: ['color-card-list.component.scss'],
    providers: [
        {provide: VpeAbstractComponent, useExisting: forwardRef(() => ColorCardListComponent)}
    ]
})
export class ColorCardListComponent extends VpeAbstractComponent implements OnInit, OnChanges, ResizeHandler {

    @Input() color: string;
    @Input() deck: Deck;
    @Output() public onclick:Subject<Card> = new Subject();
    @Output() public oninit:Subject<ColorCardListComponent> = new Subject();
    filtered: Deck;

    constructor(
        public service: DeckService
    ) {
        super();
        this.filterColor();
    }


    private filterColor() {
        setTimeout(async _ => {
            await this.service.waitLoaded;
            this.filtered = this.service.filterColor(this.color, this.deck || this.service.deck);
        }, 0);
    }

    update() {
        // console.log("ColorCardListComponent.update()", this.filtered, this.deck, this.service.selection);
        this.filterColor();
    }

    ngOnChanges() {
        this.filterColor();
    }

    onResize(e: ResizeEvent) {
        
    }

    ngOnInit() {
        this.oninit.next(this);
    }  

    cardClicked(card) {
        console.log("ColorCardListComponent.cardClicked", card);
        this.onclick.next(card);
    }

}