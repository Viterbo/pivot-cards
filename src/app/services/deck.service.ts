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
        this.selection_ok = false;
        this.http.get<Deck>("assets/json/cards.json").subscribe(
            (value) => {
                this.deck = value;
                this.sortDeck(this.deck);
                this.availables = this.deck.slice();
                console.log("DeckService:", this);
                this.resetCanvas();
                this.setLoaded(value);
            },
            (value) => {
                console.error("error", value);
            }
        );
    }

    sortDeck(deck: Deck) {
        deck.sort((a,b) => {
            
            if (parseInt(a.deck) < parseInt(b.deck)) {
                return -1;
            }
            if (parseInt(a.deck) > parseInt(b.deck)) {
                return 1;
            }

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
        });
    }

    cardId(c:Card): string {
        return "deck-"+c.deck+".card-"+c.card;
    }

    // colors ------------------------
    filterColor(color:string, deck:Deck = this.deck) {
        //console.log("filterColor() color: ", color, "-------------");
        // await this.waitLoaded;
        let filtered_deck = deck.filter(card => {
            // console.log(card.color, color, card.color == color);
            return card.color == color;
        });
        //console.log("filterColor() color: ", color, "-------------");
        return filtered_deck;
    }

    shift(deck:Deck = this.deck) {
        deck.push(deck.shift());
        return deck;
    }

    unshift(deck:Deck = this.deck) {
        deck.unshift(deck.pop());
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
        this.selection_ok = false;
    }

    findCardIndex(deck:Deck, card:Card) {
        for(var i = 0; i < deck.length; i += 1) {
            if(deck[i].card === card.card) {
                return i;
            }
        }
        return -1;
    }


    takeOutCardFromDeck(deck:Deck, card:Card) {
        let index = this.findCardIndex(deck, card);
        deck.splice(index, 1);
        return deck;
    }

    selectCard(c:Card) {
        this.takeOutCardFromDeck(this.availables, c);
        // this.availables = this.availables.filter((ejemplar) => ejemplar.card != c.card );
        // let index = this.findCardIndex(this.availables, c);
        // this.availables.splice(index, 1);
        this.selection.push(c);
        this.isselected[this.cardId(c)] = true;
        this.updateIsSelectionOk();
        console.debug("selectCard()", [this.selection], [this.availables]);
    }

    deselectCard(c:Card) {
        // this.selection = this.selection.filter((ejemplar) => ejemplar.card != c.card );
        this.takeOutCardFromDeck(this.selection, c);

        /*/
        // la anterior más cercana
        let i = 0;
        // let anterior = Number(parseInt(c.card) - 1).toString();
        
        let num = parseInt(c.card) - 1;
        let best = 0;
        let best_i = 0;
        while(i<this.availables.length-1 && parseInt(this.availables[i].card) != num) {
            if (parseInt(this.availables[i].card) >= best && parseInt(this.availables[i].card) < num) {
                best = parseInt(this.availables[i].card);
                best_i = i+1;
            };
            i++;
        }
        if (parseInt(this.availables[i].card) == num) {
            best_i = i+1;
        }

        console.debug("deselectCard()", best_i, best, c.card, [this.availables[best_i-1].card, this.availables[best_i].card, this.availables[best_i+1].card]);
        this.availables.splice(best_i, 0, c);
        console.debug("deselectCard()", best_i, best, c.card, [this.availables[best_i-1].card, this.availables[best_i].card, this.availables[best_i+1].card]);
        /*/
        this.availables.push(c);
        this.sortDeck(this.availables);
        //*/
        this.isselected[this.cardId(c)] = false;
        this.updateIsSelectionOk();
    }

    isCardSelected(c:Card) {
        return this.isselected[this.cardId(c)];
    }

    selection_ok:any;
    isSelectionOK() {
        if (this.selection_ok == null) {
            this.selection_ok = false;
            setTimeout(this.updateIsSelectionOk.bind(this));
        }
        return this.selection_ok;
    }
    
    private updateIsSelectionOk() {
        this.selection_ok = false;
        if (
            this.filterColor('red', this.selection).length > 0 &&
            this.filterColor('blue', this.selection).length > 0 &&
            this.filterColor('green', this.selection).length > 0 &&
            this.filterColor('yellow', this.selection).length > 0
        ) {
            this.selection_ok = true;
        }        
    }

    // canvas and pitch -------------------------
    subset: Deck;
    canvas: {[key:string]:Deck};

    resetCanvas() {
        this.subset = this.selection.slice();
        this.canvas = {
            red:[],
            blue:[],
            green:[],
            yellow:[],
        };
        this.updateIsCanvasOk();
    }

    addToCanvas(c:Card):boolean {
        if (this.canvas[c.color].length >= 2) return false;
        this.subset = this.subset.filter((ejemplar) => ejemplar.card != c.card );
        this.canvas[c.color].push(c);
        this.updateIsCanvasOk();
        console.log("addToCanvas()->:", this.canvas, [this.subset]);
        return true;
    }

    removeFromCanvas(c:Card) {
        this.canvas[c.color] = this.canvas[c.color].filter((ejemplar) => ejemplar.card != c.card );
        this.subset.push(c);
        this.sortDeck(this.subset);
        this.updateIsCanvasOk();
        console.log("removeFromCanvas()->:", this.canvas, [this.subset]);
    }

    canvas_ok:any;
    isCanvasOK() {
        if (this.canvas_ok == null) {
            this.canvas_ok = false;
            setTimeout(this.updateIsCanvasOk.bind(this));
        }
        return this.canvas_ok;
    }

    private updateIsCanvasOk() {
        this.canvas_ok = false;
        if (
            this.canvas.red.length > 0 && this.canvas.red.length <= 2 &&
            this.canvas.blue.length > 0 && this.canvas.blue.length <= 2 &&
            this.canvas.green.length > 0 && this.canvas.green.length <= 2 &&
            this.canvas.yellow.length > 0 && this.canvas.yellow.length <= 2
        ) {
            this.canvas_ok = true;
        }        
    }


    public getPitch() {
        let pitch = "pitch";
        let part_1 = "Mi proyecto consiste en un negocio de";
        let part_2 = "ofrecida";
        let part_3 = "mediante";
        let part_4 = "que monetice por";

        // Mi proyecto consiste en un negocio de <NEGOCIO> <QUE.texto_previo> <QUE.nombre> ofrecida <QUIEN.texto_previo> <QUIEN.nombre> mediante <COMO.texto_previo> <COMO.nombre> que monetice por <CUANTO.texto_previo> <CUANTO.nombre>

        pitch = part_1 + " " + this.industria + " ";
        for (let i=0; i<this.canvas.red.length; i++) {
            if (i>0) pitch += " y ";
            pitch += this.canvas.red[i].prev + " " + this.canvas.red[i].name;
        }

        pitch += " " + part_2 + " ";
        for (let i=0; i<this.canvas.blue.length; i++) {
            if (i>0) pitch += " y ";
            pitch += this.canvas.blue[i].prev + " " + this.canvas.blue[i].name;
        }

        pitch += " " + part_3 + " ";
        for (let i=0; i<this.canvas.green.length; i++) {
            if (i>0) pitch += " y ";
            pitch += this.canvas.green[i].prev + " " + this.canvas.green[i].name;
        }

        pitch += " " + part_4 + " ";
        for (let i=0; i<this.canvas.yellow.length; i++) {
            if (i>0) pitch += " y ";
            pitch += this.canvas.yellow[i].prev + " " + this.canvas.yellow[i].name;
        }

        pitch += ".";

        return pitch;
    }

    /*
    - wish list:
        - podés tener más (recordar) de una selección o de una solución canvas.
        - eventualmente se puede implementar una suerte de localstore con selecciones o resultados canvases con un nombre que dijita el usuario.
    */

}