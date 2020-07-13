import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { DeckService } from 'src/app/services/deck.service';

@Component({
    selector: 'filter-page',
    templateUrl: 'filter.page.html',
    styleUrls: ['filter.page.scss'],
})
export class FilterPage {

    page: string = "filter";
    toilet_card_fade:string;
    // private onToiletSelectedSubscriber: Subscriber<any>;
    
    constructor(
        public router: Router,
        public deck: DeckService,
    ) {
        this.toilet_card_fade = "";
        // this.onToiletSelectedSubscriber = new Subscriber<any>(this.onToiletSelected.bind(this));
    }

    ngOnInit() {
        // this.toilets.onSelected.subscribe(this.onToiletSelectedSubscriber);
    }


    ngOnDestroy() {
        // this.onToiletSelectedSubscriber.unsubscribe();
    }

    
    onCardClick(card) {
        console.log("onCardClick",[card]);
        this.router.navigate(['/canvas']); 
    }

}