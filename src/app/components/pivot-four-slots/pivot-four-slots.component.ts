import { Component, OnInit, Input, Output, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { CardSlotComponent } from '../card-slot/card-slot.component';
import { Card, Deck, DeckService } from 'src/app/services/deck.service';


const MDEO_EXTENT = [-6358249.62941, -4213839.90042, -6226491.30192, -4114146.90629 ];

interface ToiletFeature {
    get(string): any;
    getProperties(): string[];
    getId(): string;
}

@Component({
    selector: 'pivot-four-slots',
    templateUrl: "pivot-four-slots.component.html",
    styleUrls: ['pivot-four-slots.component.scss']
})
export class PivotFourSlotsComponent implements OnInit, OnChanges {

    @Input() deck: Deck;
    @Input() show_label: boolean;
    @Input() description: boolean = true;
    @Output() public oncard:Subject<Card> = new Subject();
    @Output() public oninit:Subject<PivotFourSlotsComponent> = new Subject();
    count: {[key:string]:number};
    
    constructor(
        public service: DeckService
    ) {
        this.show_label = false;
        this.clearCount();
    }

    private async init() {
        await this.service.waitLoaded;
        this.update();
        this.oninit.next(this);
        setTimeout(() => {
            this.updateSelected();
        }, 1000);
    }
    
    ngOnInit() {
        this.init();
    }

    ngOnChanges() {
        this.updateSelected();
    }

    slots: {[name:string]:CardSlotComponent} = {};
    registerSlot(name:string, slot: CardSlotComponent) {
        this.slots[name] = slot;
    }

    next(color:string) {
        this.slots[color].next();
    }
    
    prev(color:string) {
        this.slots[color].prev();
    }
    
    btnDisable(color:string) {
        return this.count[color] == 1;
    }

    btnHidden(color:string) {
        return this.count[color] == 0;
    }

    update() {
        // console.error("PivotFourSlotsComponent.update()");

        if (this.slots.red) this.slots.red.update();
        if (this.slots.blue) this.slots.blue.update();
        if (this.slots.green) this.slots.green.update();
        if (this.slots.yellow) this.slots.yellow.update();

        this.updateSelected();
    }

    private clearCount() {
        this.count = {
            red: 0,
            blue: 0,
            green: 0,
            yellow: 0,
        };
    }
    private async updateSelected() {
        await this.service.waitLoaded;
        this.clearCount();
        this.count.red = this.service.filterColor('red', this.deck).length;
        this.count.blue = this.service.filterColor('blue', this.deck).length;
        this.count.green = this.service.filterColor('green', this.deck).length;
        this.count.yellow = this.service.filterColor('yellow', this.deck).length;
    }

    onCardClick(c:Card) {
        this.oncard.next(c);
    }

}