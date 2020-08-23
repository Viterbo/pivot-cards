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

    
    
    @Input() autoselect: boolean;
    @Input() color: string;
    @Input() deck: Deck;
    @Output() public onclick:Subject<Card> = new Subject();
    @Output() public onInit:Subject<CardSlotComponent> = new Subject();
    @Output() public onChange:Subject<Card> = new Subject();
    filtered: Deck;

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
        this.filterColor();
    }

    private filterColor() {
        setTimeout(async _ => {
            await this.service.waitLoaded;
            this.filtered = this.service.filterColor(this.color, this.deck || this.service.deck);
            console.log("++ ",this.color,"this.filtered", this.filtered);
            if (this.filtered && this.filtered.length > 0 && this.autoselect) {
                this.selectRandom();
            }
        }, 0);
    }

    ngOnChanges() {
        console.log("ngOnChanges", this.color);
        this.filterColor();
        this.card = {
            card: "",
            color: this.color,
            deck: "",
            desc: "",
            name: "",
            prev: ""
        }
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

    private shuffleDeck(array) {
        var currentIndex = (array||[]).length, temporaryValue, randomIndex;
      
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

    selectRandom() {
        this.card = this.filtered[Math.floor(Math.random() * this.filtered.length)];
    }

    shuffle() {
        console.log("+++ shuffle() --> ", this.color, [this.filtered[0]]);
        this.shuffleDeck(this.filtered);
        this.card = this.filtered[0];
        // console.log(this.color, "luego: ", this.filtered[0].card);
        this.onChange.next(this.card);
    }

    prev() {
        // console.log(this.color, "antes: ", this.filtered[0].card);
        this.filtered = this.service.unshift(this.filtered);
        this.card = this.filtered[0];
        // console.log(this.color, "luego: ", this.filtered[0].card);
        this.onChange.next(this.card);
    }

    next() {
        // console.log(this.color, "antes: ", this.filtered[0].card);
        this.filtered = this.service.shift(this.filtered);
        this.card = this.filtered[0];
        // console.log(this.color, "luego: ", this.filtered[0].card);
        this.onChange.next(this.card);
    }

}