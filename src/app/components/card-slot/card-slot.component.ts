import { Component, OnInit, Input, Output, forwardRef, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { DeckService, Card, Deck } from 'src/app/services/deck.service';
import { VpeAbstractComponent } from '../vpe-components.service';
import { ResizeHandler, ResizeEvent } from '../vpe-resize-detector.directive';

@Component({
    selector: 'card-slot',
    templateUrl: "card-slot.component.html",
    styleUrls: ['card-slot.component.scss'],
    providers: [
        {provide: VpeAbstractComponent, useExisting: forwardRef(() => CardSlotComponent)}
    ]
})
export class CardSlotComponent extends VpeAbstractComponent implements OnInit, OnChanges, ResizeHandler {

    
    @Input() color: string;
    @Output() public onclick:Subject<Card> = new Subject();
    @Output() public onInit:Subject<CardSlotComponent> = new Subject();
    @Output() public onChange:Subject<Card> = new Subject();
    deck: Deck;

    card: Card;

    slideOpts = {
        slidesPerView: 4,
        freeMode: true,
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        }
    }

    constructor(
        public service: DeckService
    ) {
        super();
        this.updateColor();
    }

    updateColor() {
        setTimeout(async _ => {
            await this.service.waitLoaded;
            this.deck = this.service.filterColor(this.color);
            this.card = {
                card: "",
                color: this.color,
                deck: "",
                desc: "",
                name: "",
                prev: ""
            }
    
            // console.log("this.deck", this.deck);
        }, 0);
    }

    ngOnChanges(event) {
        this.updateColor();
    }

    onResize(e: ResizeEvent) {
        //console.log("CardSlotComponent.onResize()", e);
    }

    ngOnInit() {
        // deck
        this.onInit.next(this);
        this.onChange.next(null);
    }

    // onCardClick(card) {
    //     console.log("_click", [card]);
    //     // this.onclick.next(this.feature);
    // }

    getCard(): Card {
        return this.card;
    }

    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (currentIndex > 0) {
        
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
        
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
      
        return array;
    }

    run() {
        // console.log(this.color, "antes: ", this.deck[0].card);
        this.shuffle(this.deck);
        this.card = this.deck[0];
        // console.log(this.color, "luego: ", this.deck[0].card);
        this.onChange.next(this.card);
    }

}