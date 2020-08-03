import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';


export interface Card {
    color: string,
    card: string, 
    desc: string,
    name: string,
    prev: string,
    deck: string
}

export type Deck = Array<Card>;

@Injectable()
export class DeckService {
    
    private setLoaded: Function;
    public waitLoaded = new Promise(resolve => {
        this.setLoaded = resolve;
    });

    public onSelected:Subject<any> = new Subject();
    public deck:Deck;

    public industria: string;
    
    constructor(
        public http: HttpClient,
    ) {
        this.isselected = {};
        this.availables = [];
        this.selection = [];
        this.subset = [];
        this.canvas = [];
        this.http.get<Deck>("assets/json/cards.json").subscribe(
            (value) => {
                this.deck = value;
                this.sortDeck(this.deck);
                this.availables = this.deck.slice();
                console.log("DeckService:", this);
                this.setLoaded(value);
            },
            (value) => {
                console.error("error", value);
            }
        );
    }

    sortDeck(deck: Deck) {
        deck.sort((a,b) => {
            /*
            if (a.color == 'red' && b.color == 'blue') {
                return -1;
            }
            if (b.color == 'red' && a.color == 'blue') {
                return 1;
            }
            */
            if (parseInt(a.card) < parseInt(b.card)) {
                return -1;
            }
            if (parseInt(a.card) > parseInt(b.card)) {
                return 1;
            }
            return 0;
        })        
    }

    cardId(c:Card): string {
        return "deck-"+c.deck+".card-"+c.card;
    }

    // colors ------------------------
    async filterColor(color:string) {
        //console.log("filterColor() color: ", color, "-------------");
        await this.waitLoaded;
        let deck = this.deck.filter(card => {
            // console.log(card.color, color, card.color == color);
            return card.color == color;
        });
        //console.log("filterColor() color: ", color, "-------------");
        return deck;
    }

    // subselection ------------------
    isselected: {[key:string]:boolean};
    selection: Deck;
    availables: Deck;

    resetSelection() {
        this.availables = this.deck.slice();
        this.selection = [];
        this.isselected = {};
    }

    selectCard(c:Card) {
        this.availables = this.availables.filter((ejemplar) => ejemplar.card != c.card );
        this.selection.push(c);
        this.isselected[this.cardId(c)] = true;
        console.log("selectCard()->:", this.selection, this.availables);
    }

    deselectCard(c:Card) {
        this.selection = this.selection.filter((ejemplar) => ejemplar.card != c.card );
        this.availables.push(c);
        this.sortDeck(this.availables);
        this.isselected[this.cardId(c)] = false;
        console.log("deselectCard()->:", this.selection, this.availables);
    }

    isCardSelected(c:Card) {
        return this.isselected[this.cardId(c)];
    }

    // canvas and pitch -------------------------
    subset: Deck;
    canvas: Deck;

    resetCanvas() {
        this.subset = this.availables.slice();
        this.canvas = [];
    }

    addToCanvas(c:Card) {
        this.subset = this.subset.filter((ejemplar) => ejemplar.card != c.card );
        this.canvas.push(c);
        console.log("addToCanvas()->:", this.canvas, this.subset);
    }

    removeFromCanvas(c:Card) {
        this.canvas = this.canvas.filter((ejemplar) => ejemplar.card != c.card );
        this.subset.push(c);
        this.sortDeck(this.subset);
        console.log("removeFromCanvas()->:", this.canvas, this.subset);
    }

    /*
    - wish list:
        - podés tener más (recordar) de una selección o de una solución canvas.
        - eventualmente se puede implementar una suerte de localstore con selecciones o resultados canvases con un nombre que dijita el usuario.
    */

}