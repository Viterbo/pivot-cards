import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { DeckService, Deck, Card } from 'src/app/services/deck.service';

@Component({
    selector: 'selection-page',
    templateUrl: 'selection.page.html',
    styleUrls: ['selection.page.scss'],
})
export class SelectionPage {

    page: string = "selection";
    filter_color: string;
    availables_filtered: Deck;
    selection_filtered: Deck;
    // private onToiletSelectedSubscriber: Subscriber<any>;
    
    constructor(
        public router: Router,
        public service: DeckService,
    ) {
        this.filterColor('all');
    }

    get availables(): Deck {
        if (this.filter_color != 'all') {
            if (this.availables_filtered) {
                return this.availables_filtered;
            } else {
                setTimeout(_ => {
                    this.availables_filtered = this.service.filterColor(this.filter_color, this.service.availables);
                });
                return this.selection_filtered;
            }
        } 
        return this.service.availables;
    }

    get selection(): Deck {
        if (this.filter_color != 'all') {
            if (this.selection_filtered) {
                return this.selection_filtered;
            } else {
                setTimeout(_ => {
                    this.selection_filtered = this.service.filterColor(this.filter_color, this.service.selection);
                });
                return this.selection_filtered;
            }
        } 
        return this.service.selection;
    }

    get showGoToCanvas() {
        return this.service.isSelectionOK();
    }

    ionViewWillEnter() {
        this.filterColor('all');
    }

    onFinish() {
        console.debug("SelectionPage.onFinish()",[]);
    }

    _click(e) {
        console.debug("_click", [e]);
    }

    filterColor(color) {
        // console.debug("PivotDeckComponent.filterColor()", color);
        this.filter_color = color;
        this.availables_filtered = this.service.filterColor(this.filter_color, this.service.availables);
        this.selection_filtered = this.service.filterColor(this.filter_color, this.service.selection);
    }

    ordenarSeleccion() {
        this.service.sortDeck(this.service.selection);
        this.selection_filtered = this.service.filterColor(this.filter_color, this.service.selection);
    }

    ordenarAvailables() {
        this.service.sortDeck(this.service.availables);
    }

    debug: boolean;
    onCardClick(card:Card) {
        console.debug("PivotDeckComponent.onCardClick()", card);
        setTimeout(_ => {
            if (this.service.isCardSelected(card)) {
                this.service.deselectCard(card);
            } else {
                this.service.selectCard(card);
            }
            this.debug = true;
            this.availables_filtered = this.service.filterColor(this.filter_color, this.service.availables);
            this.selection_filtered = this.service.filterColor(this.filter_color, this.service.selection);
            this.debug = false;    
        });
    }

    goToCanvas() {
        this.router.navigate(['/canvas']); 
    }

    goHome() {
        this.router.navigate(['/home']); 
    }

    shift() {
        this.service.shift(this.availables);
    }

    unshift() {
        this.service.unshift(this.availables);
    }
}
