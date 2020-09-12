import { Component, OnInit, Input, Output, forwardRef, ElementRef, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DeckService, Card, Deck } from 'src/app/services/deck.service';
import { ResizeHandler, ResizeEvent } from '../vpe-resize-detector.directive';
import { VpeAbstractComponent } from '../vpe-components.service';
import { PivotCardComponent } from '../pivot-card/pivot-card.component';
import { IonSlides, IonSlide } from '@ionic/angular';

@Component({
    selector: 'pivot-deck',
    templateUrl: "pivot-deck.component.html",
    styleUrls: ['pivot-deck.component.scss'],
    providers: [
        {provide: VpeAbstractComponent, useExisting: forwardRef(() => PivotDeckComponent)}
    ]
})
export class PivotDeckComponent extends VpeAbstractComponent implements OnInit, OnChanges, ResizeHandler, AfterViewInit {


    @Input() deck: Deck;
    @Input() cardWidth: number;
    @Output() public onCardClick:Subject<Card> = new Subject();

    slides:number;
    turn: boolean;
    visible: boolean;

    // @ViewChild('ref', {read: Slides}) ref: Slides;
    // @ViewChild(IonSlides) ref: IonSlides;
    // @ViewChild("myDiv") divView: ElementRef;
    @ViewChild("ref") ref: ElementRef;

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
        // console.log("PivotDeckComponent.constructor()");
    }

    ngAfterViewInit() {
        // console.log("PivotDeckComponent.ngAfterViewInit() ------------> ", this.element.nativeElement.width);
    }

    onResize(e: ResizeEvent) {
        console.log("PivotDeckComponent.onResize()", [e]);
        // console.log("this.element.nativeElement.width:", this.element.nativeElement.width); 
        // console.log("this.cardWidth:", this.cardWidth); 
        
        this.slides = Math.floor(this.element.nativeElement.offsetWidth / this.cardWidth);
        if (typeof this.element.nativeElement.width == "undefined") {
            this.slides = Math.floor(e.device.width / this.cardWidth);
            // console.log("*******", this.slides );
        }
        // console.log("this.slides:", this.slides); 
        this.slideOpts.slidesPerView = this.slides;
        // console.log("this.divView: ------------> ", this.element.nativeElement.children[0].children[0].children[0].children[0].children);
        
        // console.log("this.slideOpts.slidesPerView:", this.slideOpts.slidesPerView);
        this.resetView();
    }

    ngOnChanges(c) {
        console.log("PivotDeckComponent.ngOnChanges()", [c]);
        this.resetView();
    }

    resetView() {
        // setTimeout(_ => {this.turn = !this.turn;}, 1000);
        

       
        // Esto fue un intento por arreglar el problema de que a veces aparece una sola slide ocupando todo el ancho
        /*
        let real_width = 0
        try {
            console.log("***** this.resetView()", this.ref.nativeElement.children);
            real_width = this.ref.nativeElement.children[0].children[0].offsetWidth;
            console.error("real_width: ", real_width, "window.innerWidth: ", window.innerWidth, "slidesPerView: ", this.slideOpts.slidesPerView);
        } catch(e){
            console.log("** this.setTimeout(100)");
            let self = this;
            setTimeout(_ => {
                // self.resetView();
            }, 100);
        }
        */



        
        setTimeout(_ => {this.visible = false;}, 0);
        setTimeout(_ => {this.visible = true;}, 10);
        
    }

    ngOnInit() {
        // console.log("PivotDeckComponent.ngOnInit()");
    }

    _click(card:Card) {
        // console.log("PivotDeckComponent._click()", [card]);
        // console.log("this.divView: ------------> ", this.ref.nativeElement.children[0].children[0].offsetWidth);
        
        this.onCardClick.next(card);
        // this.resetView();
    }


}