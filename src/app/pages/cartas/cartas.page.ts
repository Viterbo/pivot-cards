import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { DeckService, Deck, Card } from 'src/app/services/deck.service';
import { AppService } from 'src/app/services/common/app.service';

@Component({
    selector: 'cartas-page',
    templateUrl: 'cartas.page.html',
    styleUrls: ['cartas.page.scss'],
})
export class CartasPage {

    page: string = "selection";
    filter_color: string;
    availables_filtered: Deck;
    selection_filtered: Deck;
    // private onToiletSelectedSubscriber: Subscriber<any>;
    
    constructor(
        public router: Router,
        public deck: DeckService,
        public app: AppService
    ) {
        this.availables_filtered = [];
        this.selection_filtered = [];
        this.filterColor('all');
    }

    //*/
    get availables(): Deck {
        return this.availables_filtered;
    }

    get selection(): Deck {
        return this.selection_filtered;
    }
    /*/
    get availables(): Deck {
        if (this.filter_color != 'all') {
            if (this.availables_filtered) {
                return this.availables_filtered;
            } else {
                setTimeout(_ => {
                    this.availables_filtered = this.deck.filterColor(this.filter_color, this.deck.availables);
                });
                return this.selection_filtered;
            }
        } 
        return this.deck.availables;
    }

    get selection(): Deck {
        if (this.filter_color != 'all') {
            if (this.selection_filtered) {
                return this.selection_filtered;
            } else {
                setTimeout(_ => {
                    this.selection_filtered = this.deck.filterColor(this.filter_color, this.deck.selection);
                });
                return this.selection_filtered;
            }
        } 
        return this.deck.selection;
    }
    //*/

    get showGoToCanvas() {
        return this.deck.isSelectionOK();
    }

    ionViewWillEnter() {
        this.filterColor('all');
    }

    onFinish() {
        console.debug("CartasPage.onFinish()",[]);
    }

    _click(e) {
        console.debug("_click", [e]);
    }

    filterColor(color) {
        // console.debug("PivotDeckComponent.filterColor()", color);
        this.filter_color = color;
        // this.availables_filtered = this.deck.filterColor(this.filter_color, this.deck.availables);
        // this.selection_filtered = this.deck.filterColor(this.filter_color, this.deck.selection);
        this.updateFiltered(this.availables_filtered, this.deck.availables);
        this.updateFiltered(this.selection_filtered, this.deck.selection);
    }

    ordenarSeleccion() {
        this.deck.sortDeck(this.deck.selection);
        // this.selection_filtered = this.deck.filterColor(this.filter_color, this.deck.selection);
        this.updateFiltered(this.selection_filtered, this.deck.selection);
    }

    ordenarAvailables() {
        this.deck.sortDeck(this.deck.availables);
        this.updateFiltered(this.availables_filtered, this.deck.availables);
    }

    updateFiltered(filtered:Deck, deck:Deck) {
        filtered.splice(0,filtered.length);
        for (let i=0; i<deck.length; i++) {
            let card = deck[i];
            if (card.color == this.filter_color || this.filter_color == 'all') {
                filtered.push(card);
            }
        }
        return filtered;
    }

    debug: boolean;
    onCardClick(card:Card) {
        console.debug("PivotDeckComponent.onCardClick()", card);
        setTimeout(_ => {
            if (this.deck.isCardSelected(card)) {
                this.deck.deselectCard(card);
            } else {
                this.deck.selectCard(card);
            }
            this.debug = true;

            // acá está el problema --------------
            this.updateFiltered(this.availables_filtered, this.deck.availables);
            this.updateFiltered(this.selection_filtered, this.deck.selection);
            // this.availables_filtered = this.deck.filterColor(this.filter_color, this.deck.availables);
            // this.selection_filtered = this.deck.filterColor(this.filter_color, this.deck.selection);
            // ------------------------------------



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
        this.deck.shift(this.availables);
    }

    unshift() {
        this.deck.unshift(this.availables);
    }
}
