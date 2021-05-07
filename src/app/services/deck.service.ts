import { Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { LocalStringsService } from './common/common.services';


export class Pitch {
    html:string;
    text:string;
    parts?:Pitch[];
    b?:string;
    c?:string;
    constructor(a:string, b:string=null, c:string=null){
        this.text = a;
        this.html = b?b:a;
        this.b = "";
        this.c = "";
        if (c) {
            this.html = b + a + c;
            this.b = b;
            this.c = c;
        }
    };
}

export interface FilterOption {
    text: string,
    cards: number[];
    hascard?: {[index:string]:boolean};
}

export interface Filter {
    text: string,
    options: FilterOption[];
}

export type Filters = Array<Filter>;

export interface Card {
    color: string,
    card: string, 
    desc: string,
    name: string,
    prev: string,
    post: string,
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
    public deck:Deck = [];
    
    private setFilters: Function;
    public waitFilters = new Promise(resolve => {
        this.setFilters = resolve;
    });    
    public filters:Filters;

    @Output() public onpitch:Subject<Pitch> = new Subject();

    public industria: string;
    
    constructor(
        public http: HttpClient,
        public local: LocalStringsService
    ) {
        this.isselected = {};
        this.availables = [];
        this.selection = [];
        this.subset = [];
        this.selection_ok = false;
        this.resetCanvas();
        this.http.get<Deck>("assets/json/cards.json").subscribe(
            (value) => {
                this.deck = value;
                this.sortDeck(this.deck);
                this.availables = this.deck.slice();
                console.log("Cards Loaded:", this.availables);
                this.resetCanvas();
                this.setLoaded(value);
            },
            (value) => {
                console.error("error cards.json", value);
            }
        );
        this.http.get<Filters>("assets/json/filters.json").subscribe(
            (value) => {
                this.filters = value;
                for (let i in this.filters) {
                    let filter:Filter = this.filters[i];
                    for (let j in filter.options) {
                        let option:FilterOption = filter.options[j];
                        for (let c in option.cards) {
                            let numb: number = option.cards[c];
                            option.hascard = option.hascard || {};
                            option.hascard[(new Number(numb)).toString()] = true;
                        }
                    }
                }
                console.log("Filters Loaded:", this.filters);
                this.setFilters(value);
            },
            (value) => {
                console.error("error filters.json", value);
            }
        );
    }


    async refreshFilters() {
        await this.waitFilters;
        let filters = null;
        try {
            filters = JSON.parse(JSON.stringify(this.filters));
        } catch(e) {
            console.error("ERROR: no se pudo parsear el JSON", this.filters);
            filters = [];
        }
        
        this.filters = filters;
        console.log("refreshFilters()", this.filters);
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
        // console.debug("selectCard()", [this.selection], [this.availables]);
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

    filterCards(answers:string[], deck:Deck = this.availables) {
        console.debug("DeckService.filterCards()", answers);
        let filtered: Deck = [];
        let applyFilter: boolean = false;
        for (let i in deck) {
            let card = deck[i];
            let rejected: boolean = false;
            // console.debug("- i,card", i, card);
            for (let a in answers) {
                let answer:string = answers[a];
                if (answer) {
                    applyFilter = true;
                    let index:number = parseInt(answer);
                    // console.debug("-- a,answer,index", a,answer,index);
                    console.assert(!isNaN(index), "ERROR: index = NaN, answer: ", answer);
                    let options = this.filters[a].options;
                    if (!options[index].hascard[card.card]) {
                        rejected = true;
                    }
                    // console.debug("-- card.card:", card.card, options[index].hascard[card.card], "rejected: ", rejected);
                } else {
                    // console.debug("-- a,answer,index", a,answer);
                }
            }

            if (!rejected) {
                filtered.push(card);
            }
        }

        return applyFilter ? filtered : deck;
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

    // canvas  -------------------------
    subset: Deck;
    canvas: {[key:string]:Deck};

    resetCanvas() {
        console.error("resetCanvas()");
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
        if (this.canvas[c.color][0] && this.canvas[c.color][0].card == c.card) return; // repetida 
        if (this.canvas[c.color][1] && this.canvas[c.color][1].card == c.card) return; // repetida 
        this.canvas[c.color].push(c);
        this.updateIsCanvasOk();
        // console.log("addToCanvas()->:", this.canvas, [this.subset]);
        return true;
    }

    removeFromCanvas(c:Card) {
        this.canvas[c.color] = this.canvas[c.color].filter((ejemplar) => ejemplar.card != c.card );
        this.subset.push(c);
        this.sortDeck(this.subset);
        this.updateIsCanvasOk();
        // console.log("removeFromCanvas()->:", this.canvas, [this.subset]);
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

    // pitch (ini) ------------------------------------------------------------
    pitch: Pitch = {html:"",text:"",parts:[]};;
    // setPitch(pitch: string) {
    //     this.pitch = pitch;
    // }


    public updatePitch() {
        this.pitch = {html:"",text:"",parts:[]};
        this.generatePitch();
        this.generatePitchHtml();
        this.generatePitchText();
        this.onpitch.next(this.pitch);
    }

    public setPitch(current:string) {
        this.generatePitch();
        this.generatePitchHtml(current);
        this.generatePitchText(current);
        this.onpitch.next(this.pitch);
    }
    
    private generatePitch() {
        // genera la estructura

        let parts:Pitch[] = [
            new Pitch(this.local.string.pitch_part_1),
            new Pitch(this.local.string.pitch_part_2),
            new Pitch(this.local.string.pitch_part_3),
            new Pitch(this.local.string.pitch_part_4),
        ]
        
        
        let falta_text = "_______";
        let y_text = this.local.string.and;

        this.pitch.parts = [];
        this.pitch.parts.push(new Pitch(parts[0].text));
        this.pitch.parts.push(new Pitch(this.industria ? this.industria : falta_text, "<b>", "</b>"));

        let colors = ["red","blue","green","yellow"];
        for (let c=0; c<colors.length; c++) {
            let color = colors[c];

            if (c>0) {
                this.pitch.parts.push(parts[c]);
            }
            if (this.canvas[color].length == 0) {
                this.pitch.parts.push(new Pitch(falta_text, "<b color='"+color+"'>", "</b>"));
            }
            for (let i=0; i<this.canvas[color].length; i++) {
                if (i>0) {
                    this.pitch.parts.push(new Pitch(y_text));
                }
                this.pitch.parts.push(new Pitch(this.local.string[this.canvas[color][i].prev], "<span color='"+color+"'>", "</span>"));
                this.pitch.parts.push(new Pitch(this.local.string[this.canvas[color][i].name], "<b color='"+color+"'>", "</b>"));
                this.pitch.parts.push(new Pitch(this.local.string[this.canvas[color][i].post], "<span color='"+color+"'>", "</span>"));
            }            
        }

        console.log("DeckService.generatePitch()", this.pitch.parts);
    }

    private generatePitchHtml(current:string=null) {
        // genera la string html
        this.generatePitchText();
        if (!current || this.pitch.text == current) {
            let parts:string[] = [];
            for (let i=0; i<this.pitch.parts.length; i++) {
                parts.push(this.pitch.parts[i].html);
            }
            this.pitch.html = parts.join(" ");
        } else {
            console.assert(typeof current == "string", typeof current );
            let parts:string[] = [];
            for (let i=0; i<this.pitch.parts.length; i++) {
                parts.push(this.pitch.parts[i].text);
            }



            let html:string[] = [];
            let begin:number[] = [];
            let ends:number[] = [];

            for (let i=0; i<parts.length; i++) {
                let part = parts[i];
                begin.push(current.indexOf(part));
            }

            let pendiente = -1;
            let end = 0;
            let textos = [];
            for (let i=0; i<parts.length; i++) {
                let part = parts[i];
                if (begin[i] != -1) {
                    if (pendiente != -1) {
                        let length = begin[i] - end -1;
                        let text = current.substr(end, length);
                        end += length + 1;
                        html.push(this.pitch.parts[pendiente].b + text + this.pitch.parts[pendiente].c);
                        textos.push(text);
                        pendiente = -1;
                    }

                    html.push(this.pitch.parts[i].html);
                    textos.push(this.pitch.parts[i].text);
                    end += part.length + 1;
                                    
                } else {
                    pendiente = i;
                }
            }

            if (pendiente != -1) {
                let text = current.substr(end);
                textos.push(text);
                html.push(this.pitch.parts[pendiente].b + text + this.pitch.parts[pendiente].c);
            }

            let texto_final = textos.join(" ");
            if (current != texto_final) {
                // fail
                this.pitch.html = current;
            } else {
                this.pitch.html = html.join(" ");
            }

            
            console.log("generatePitchHtml() -> ", html, this.pitch.html);

        }        
    }

    private generatePitchText(current:string=null) {
        // genera la string text
        if (current) {
            this.pitch.text = current;
        } else {
            let parts:string[] = [];
            for (let i=0; i<this.pitch.parts.length; i++) {
                parts.push(this.pitch.parts[i].text);
            }
            this.pitch.text = parts.join(" ");

            this.pitch.text = this.pitch.text.split("  ").join(" ");
        }
    }



}