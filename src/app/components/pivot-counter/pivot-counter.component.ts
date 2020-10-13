import { Component, OnInit, Input, Output, OnChanges, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subject, Subscriber } from 'rxjs';
import { Deck, DeckService, Pitch } from 'src/app/services/deck.service';


const MDEO_EXTENT = [-6358249.62941, -4213839.90042, -6226491.30192, -4114146.90629 ];

interface ToiletFeature {
    get(string): any;
    getProperties(): string[];
    getId(): string;
}

@Component({
    selector: 'pivot-counter',
    templateUrl: "pivot-counter.component.html",
    styleUrls: ['pivot-counter.component.scss']
})
export class PivotCounterComponent implements OnInit, OnDestroy, OnChanges {

    @Output() public oninit:Subject<PivotCounterComponent> = new Subject();
    @Input() deck: Deck;
    @ViewChild('setFocusField') setFocusField: ElementRef;

    count: {[key:string]:number};

    constructor(
        public service: DeckService
    ) {
        
    }
    
    ngOnInit() {
        this.oninit.next(this);
    }

    ngOnDestroy() {
        
    }

    ngOnChanges() {
        this.updateCounter();
    }
    
    clearCount() {
        this.count = {
            red: 0,
            blue: 0,
            green: 0,
            yellow: 0,
        };
    }

    async updateCounter() {
        await this.service.waitLoaded;
        this.clearCount();
        this.count.red = this.service.filterColor('red', this.deck).length;
        this.count.blue = this.service.filterColor('blue', this.deck).length;
        this.count.green = this.service.filterColor('green', this.deck).length;
        this.count.yellow = this.service.filterColor('yellow', this.deck).length;
    }

}