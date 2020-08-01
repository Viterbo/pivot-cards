import { Component, OnInit, Input, Output, forwardRef, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DeckService, Card, Deck } from 'src/app/services/deck.service';
import { ResizeHandler, ResizeEvent } from '../vpe-resize-detector.directive';
import { VpeAbstractComponent } from '../vpe-components.service';
import { IonSlides } from '@ionic/angular';

@Component({
    selector: 'pivot-deck',
    templateUrl: "pivot-deck.component.html",
    styleUrls: ['pivot-deck.component.scss'],
    providers: [
        {provide: VpeAbstractComponent, useExisting: forwardRef(() => PivotDeckComponent)}
    ]
})
export class PivotDeckComponent extends VpeAbstractComponent implements OnInit, ResizeHandler {


    @Input() deck: Deck;
    @Input() cardWidth: number;
    @Output() public onSelectChange:Subject<Card> = new Subject();
    @Output() public onFinish:Subject<Card> = new Subject();

    slides:number;
    turn: boolean;
    visible: boolean;

    // @ViewChild('slideref', {read: Slides}) slideref: Slides;
    // @ViewChild(IonSlides) slideref: IonSlides;
    @ViewChild('[slideref]', {read: IonSlides}) slideref: IonSlides;

    slideOpts = {
        slidesPerView: this.slides,
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
        public service: DeckService,
        public element: ElementRef
    ) {
        super();
        if (!this.cardWidth) {
            this.cardWidth = 250;
        }
        this.turn = true;
        this.visible = true;
        console.log("PivotDeckComponent.constructor()");
    }

    onResize(e: ResizeEvent) {
        console.log("PivotDeckComponent.onResize()", [e]);
        // console.log("this.element.nativeElement.width:", this.element.nativeElement.width); 
        // console.log("this.cardWidth:", this.cardWidth); 
        
        this.slides = Math.floor(this.element.nativeElement.width / this.cardWidth);
        if (typeof this.element.nativeElement.width == "undefined") {
            this.slides = Math.floor(e.device.width / this.cardWidth);
        }
        // console.log("this.slides:", this.slides); 
        this.slideOpts.slidesPerView = this.slides;
        // console.log("this.slideref: ------------> ", [this.slideref]); 
        console.log("this.slideOpts.slidesPerView:", this.slideOpts.slidesPerView);
        this.resetView();
    }

    resetView() {
        // setTimeout(_ => {this.turn = !this.turn;}, 1000);
        
        setTimeout(_ => {this.visible = false;}, 0);
        setTimeout(_ => {this.visible = true;}, 10);
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