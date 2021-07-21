import { Component, HostBinding, AfterViewInit, OnInit, AfterViewChecked, OnDestroy, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DeckService, Card } from 'src/app/services/deck.service';
import { PivotFourSlotsComponent } from 'src/app/components/pivot-four-slots/pivot-four-slots.component';
import { VpeAppPage, AppService, OnEnterPageHandler } from 'src/app/services/common/app.service';

import { jsPDF, jsPDFOptions } from "jspdf";
import { LoadingController } from '@ionic/angular';
import { PivotCounterComponent } from 'src/app/components/pivot-counter/pivot-counter.component';
import { PivotIndustriaInputComponent } from 'src/app/components/pivot-industria-input/pivot-industria-input.component';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { Subscriber, Subscription } from 'rxjs';





@Component({
    selector: 'canvas-page',
    templateUrl: 'canvas.page.html',
    styleUrls: ['canvas.page.scss'],
})
export class CanvasPage implements VpeAppPage, OnDestroy {

    
    // initialized: boolean;
    lockcanvas: boolean;
    useOverlappingCards: boolean;
    useCanvasExtended: boolean;
    useCardsExtended: boolean;
    // selected: {[key:string]:number};
    
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public deck: DeckService,
        public app: AppService,
        public loadingController: LoadingController,
        public local: LocalStringsService,
        public elementRef: ElementRef,
    ) {
        this.lockcanvas = false;
        this.useOverlappingCards = false;
        this.useCanvasExtended = true;
        this.useCardsExtended = true;
    }

    // Page common code block -------
    onResizeSuscriber: Subscriber<any> = null;
    page: OnEnterPageHandler;
    path: RegExp = /\/canvas/i;
    sub: Subscription;
    async ngOnInit() {
        this.app.subscribePage(this);
    }
    async ngOnDestroy() {
        this.app.unsubscribePage(this);
    }
    onResize() {}
    async onEnterPage() {
        this.init();
    }
    // --------------------------------


    get showPrintBtn() {
        return this.deck.isCanvasOK();
    }

    private init() {
        // if (this.initialized) return;
        // this.initialized = true;
        
        this.route.queryParams.subscribe(params => {
            
            if (params && params.lockcanvas) {
                this.lockcanvas = true;
                console.log("CanvasPage.init() this.lockcanvas: true");
            } else {
                this.lockcanvas = false;
                console.log("CanvasPage.init() updatePitch(); resetCanvas()");
                this.deck.updatePitch();
                this.deck.resetCanvas();

                this.aux();

                this.deck.sortDeck(this.deck.subset);
            }
        });
    }

    auxGetImage(canvas: HTMLCanvasElement, color: string) {
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        var img = new Image();
        img.id = "pic";
        img.src = canvas.toDataURL();
        return img;
    }

    // print PDF (ini) ------------------------------------------------
    top: number;
    left: number;
    cellw: number;
    cellh: number;
    canvasl: number;
    canvast: number;

    async print() {
        let canvas_title_offset;
        let pitch_title_offset;
        let pitch_text_offset;
        let titlesize;
        //if (this.useOverlappingCards) {
        //    this.top = 10;
        //    this.left = 5;
        //    this.cellw = 90;
        //    this.cellh = 70;
        //    this.canvasl = 10;
        //    this.canvast = 60;
        //    canvas_title_offset = 10;
        //    pitch_title_offset = 10;
        //    pitch_text_offset = 10;
        //    titlesize = 20;
        //} else {
            this.top = 10;
            this.left = 5;
            this.cellw = 90;
            this.cellh = 100;
            this.canvasl = 10;
            this.canvast = 30;
            canvas_title_offset = 10;
            pitch_title_offset = 8;
            pitch_text_offset = 8;
            titlesize = 20;
        //}

        if (!this.deck.industria) {
            this.input.showErrors();
            return;
        }

        const loading = await this.loadingController.create({
            cssClass: 'pivot-alert-class',
            message: 'Generando PDF...'
        });
        await loading.present();


        // alert("Imprimir hoja A4 con canvas y pitch");
        console.log("this.deck", this.deck);
        const element = document.getElementById('canvas');

        const pivotAzul:HTMLImageElement = <HTMLImageElement>document.getElementById('pivot-azul');
        const stickyNote:HTMLImageElement = <HTMLImageElement>document.getElementById('sticky-note');
        var canvas = document.createElement("canvas");
        canvas.width = 10;
        canvas.height = 10;


        let options:jsPDFOptions = {
            orientation: 'p',
            unit: 'px',
            format: 'a4',
        };
        let pdf:jsPDF = new jsPDF();
        console.log(pdf, pdf.fromHTML);

        // // auxiliar --------------------------------------
        // // creamos una imagen de 10x10 de fondo rojo -------------
        // //* 
        // var red = this.auxGetImage(canvas, "red");
        // var green = this.auxGetImage(canvas, "green");
        // var blue = this.auxGetImage(canvas, "blue");
        // var grey = this.auxGetImage(canvas, "grey");
        // var black = this.auxGetImage(canvas, "black");
        // var white = this.auxGetImage(canvas, "white");
        // // width:  210;
        // // height: 297;
        // // 
// 
        // 
        // pdf.addImage(grey,    'PNG',    0,   0, 210, 297); // tapo la hoja de grey
        // pdf.addImage(white,   'PNG', this.left, this.top, 200, 280); // pinto de blanco sólo la zona usable
// 
        // // horizontal
        // pdf.addImage(black,     'PNG', this.left+  0, this.top-1, 20, 1);
        // pdf.addImage(black,     'PNG', this.left+ 40, this.top-1, 20, 1);
        // pdf.addImage(black,     'PNG', this.left+ 80, this.top-1, 20, 1);
        // pdf.addImage(black,     'PNG', this.left+120, this.top-1, 20, 1);
        // pdf.addImage(black,     'PNG', this.left+160, this.top-1, 20, 1);
// 
        // // vertical
        // pdf.addImage(black,     'PNG', this.left-1, this.top+ 20, 1, 20);
        // pdf.addImage(black,     'PNG', this.left-1, this.top+ 60, 1, 20);
        // pdf.addImage(black,     'PNG', this.left-1, this.top+100, 1, 20);
        // pdf.addImage(black,     'PNG', this.left-1, this.top+140, 1, 20);
        // pdf.addImage(black,     'PNG', this.left-1, this.top+180, 1, 20);
        // pdf.addImage(black,     'PNG', this.left-1, this.top+220, 1, 20);
        // pdf.addImage(black,     'PNG', this.left-1, this.top+260, 1, 20);
        // //*/
        // // -----------------------------------------------
// 
// 

        // title image
        // pdf.addImage(pivotAzul, 'PNG', this.left+10, this.top+5, 40, 16.34);
        pdf.addImage(pivotAzul, 'PNG', this.left+this.canvasl+2*this.cellw-40, this.top+5, 40, 16.34);


        pdf.setTextColor("#032f9a");
        pdf.setFontSize(14);


        // pdf.textWithLink('www.pivot.uy', this.left+this.canvasl+2*this.cellw-40, this.top+27,
        // pdf.textWithLink('www.pivot.uy', this.left+this.canvasl+2*this.cellw-38, this.top+25,
        // pdf.textWithLink('www.pivot.uy', this.left+this.canvasl+2*this.cellw-36, this.top+22,
        // pdf.textWithLink('www.pivot.uy', this.left+this.canvasl+2*this.cellw-26, this.top+22,
        // pdf.textWithLink('www.pivot.uy', this.left+this.canvasl+2*this.cellw-28, this.top+23,
        pdf.textWithLink('http://xn--pvot-vpa.com', this.left+this.canvasl+2*this.cellw-29, this.top+23,
            {
                url: 'http://pívot.uy/'
            }
        );



        // pdf.setFillColor(56, 128, 255); // blue
        // pdf.setFillColor(235, 68, 90); // red
        // pdf.setFillColor(45, 211, 111); // green
        // pdf.setFillColor(255, 196, 9); // yellow
        // let top = 20;
        let margin = 0;
        

        // paint canvas ------------
        pdf.setTextColor("black");
        pdf.setFontSize(titlesize);
        // pdf.text(
        //     "Canvas:",
        //     this.left+this.canvasl+margin,
        //     this.top+this.canvast-canvas_title_offset
        // );    

        pdf.setFillColor(251, 217, 222); // light-red
        pdf.rect(this.left+this.canvasl, this.top+this.canvast, this.cellw, this.cellh, 'F');
        pdf.setFillColor(215, 230, 255); // light-blue
        pdf.rect(this.left+this.canvasl+this.cellw, this.top+this.canvast, this.cellw, this.cellh, 'F');
        pdf.setFillColor(213, 246, 226); // light-green
        pdf.rect(this.left+this.canvasl, this.top+this.canvast+this.cellh, this.cellw, this.cellh, 'F');
        pdf.setFillColor(255, 243, 205); // light-yellow
        pdf.rect(this.left+this.canvasl+this.cellw, this.top+this.canvast+this.cellh, this.cellw, this.cellh, 'F');


        pdf.setFontSize(24);

        pdf.setTextColor("f2a0a8"); // rojo
        pdf.text(this.local.string.what,    this.left+this.canvasl+3,              this.top+this.canvast+10 );

        pdf.setTextColor("9bb8ff"); // azul
        pdf.text(this.local.string.who,     this.left+this.canvasl+2*this.cellw-3, this.top+this.canvast+10, {align: "right"} );

        pdf.setTextColor("a0dbb3"); // verde
        pdf.text(this.local.string.how,     this.left+this.canvasl+3,              this.top+this.cellh+this.canvast+10 );

        pdf.setTextColor("ffde96"); // amarillo
        pdf.text(this.local.string.howmuch, this.left+this.canvasl+2*this.cellw-3, this.top+this.cellh+this.canvast+10, {align: "right"} );


        var colors = ["red", "blue", "green", "yellow"];
        for (let c=0; c<colors.length; c++) {
            let color = colors[c];
            for (let i=0; i<this.deck.canvas[color].length; i++) {
                let card = this.deck.canvas[color][i];
                this.printCard(pdf, card, color, i);
            }
        }

        // pitch ----------------
        pdf.setFontSize(titlesize);
        pdf.text(
            "Elevator Pitch:",
            this.left+this.canvasl+margin,
            this.top+this.canvast+this.cellh*2+canvas_title_offset+pitch_title_offset
        );
        //*/        
        pdf.setFontSize(12);
        pdf.text(
            this.deck.pitch.text,
            this.left+this.canvasl+margin,
            this.top+this.canvast+this.cellh*2+canvas_title_offset+pitch_title_offset+pitch_text_offset,
            {
                maxWidth: (this.cellw-margin)*2,
                align: 'left'
            }
        );
        /*/
        pdf.setFontSize(12);
        pdf.text(
            this.deck.pitch,
            this.left+this.canvasl+this.cellw,
            this.top+this.canvast+this.cellh*2,
            {
                maxWidth: (this.cellw-margin)*2,
                align: 'center'
            }
        );
        //*/ 



        // sticky note
        let left = this.left+this.canvasl+this.cellw;
        let top  = this.top+this.canvast+this.cellh;
        pdf.addImage(stickyNote, 'PNG', left-20, top-23, 40, 40);        


        pdf.setTextColor("black");
        pdf.setFontSize(15);
        pdf.text(
            this.deck.industria,
            left,
            top-5,
            {
                maxWidth: 30,
                align: 'center'
            }
        );

        loading.dismiss();
        pdf.save("canvas-pivot.pdf");
    }

    printCard(pdf:jsPDF, card:Card, color:string, i:number) {

        let x=this.left+this.canvasl,y=this.top+this.canvast+10;
        let w=70, h=40, r=1;
        let top = 24, left = 9;
        let head = 10;
        let card_offset_top = 42;
        let text_size = 15;
        let text_offset_top = 7;
        let text_offset_left = 3;
        let factor = 0.25;


        // ---------------
        

        // if (this.useOverlappingCards) {
        //     x=this.left+this.canvasl,y=this.top+this.canvast;
        //     w=70, h=40, r=1;
        //     top = 14, left = 9;
        //     head = 10;
        //     card_offset_top = 9;
        //     text_size = 15;
        //     text_offset_top = 7;
        //     text_offset_left = 3;
        //     factor = 0.45;
        // }


        // relativo a la esquina superior izq del cuadrante
        if (color == "green" || color == "yellow") {
            y += this.cellh;
        }

        if (color == "blue" || color == "yellow") {
            x += this.cellw;
        }

        // discrimino por casos
        if (this.deck.canvas[color].length == 1) {
            // la carta se encuentra sola y la centramos
            x += left;
            y += top;
        } else {
            // son dos cartas
            x += Math.round(left * (i+0.6));
            y += Math.round(top * (i?2-factor:factor));
        }

        // sombra
        // pdf.setFillColor("#333333");
        pdf.setDrawColor("#333333");
        pdf.setLineWidth(1);
        // pdf.roundedRect(x, y, w, h, r, r, 'S');
        // let z = 0.5;
        // pdf.roundedRect(x-z, y-z, w, h, r, r, 'F');
        // // pdf.roundedRect(x-z, y-z, w+z+z, h+z+z, r+z, r+z, 'F');

        // pinto cabezal
        switch(color) {
            case "red": pdf.setFillColor(207, 60, 79); break;    // dark-red
            case "blue": pdf.setFillColor(49, 113, 224); break;  // dark-blue
            case "green": pdf.setFillColor(40, 186, 98); break;  // dark-green
            case "yellow": pdf.setFillColor(224, 172, 8); break; // dark-yellow
        }
        pdf.roundedRect(x, y, w, h, r, r, 'F');

        // pinto cuerpo
        switch(color) {
            case "red": pdf.setFillColor(235, 68, 90); break;    // dark-red
            case "blue": pdf.setFillColor(56, 128, 255); break;  // dark-blue
            case "green": pdf.setFillColor(45, 211, 111); break;  // dark-green
            case "yellow": pdf.setFillColor(255, 196, 9); break; // dark-yellow
        } 

        // pdf.roundedRect(x, y+head, w, h-head, r, r, 'F');
        pdf.rect(x, y+head, w, h-head-r-r, 'F');

        // borde
        pdf.setDrawColor("black");
        switch(color) {
            case "red": pdf.setDrawColor(207, 60, 79); break;    // dark-red
            case "blue": pdf.setDrawColor(49, 113, 224); break;  // dark-blue
            case "green": pdf.setDrawColor(40, 186, 98); break;  // dark-green
            case "yellow": pdf.setDrawColor(224, 172, 8); break; // dark-yellow
        }        
        pdf.setLineWidth(0.5);
        pdf.roundedRect(x, y, w, h, r, r, 'S');      

        // pinto title
        switch(color) {
            case "red":
            case "blue":
            case "green":
                pdf.setTextColor("white");
                break;
            case "yellow":
                pdf.setTextColor("black");
                break;
        }
        let title = card.card + " - " + this.local.string[card.name];
        let size = text_size;
        top = text_offset_top;
        left = text_offset_left;
        
        if (title.length > 25) {
            size = text_size-1;
            top = text_offset_top;
        }
        if (title.length > 28) {
            size = text_size-2;
            top = text_offset_top;
        }
        if (title.length > 31) {
            size = text_size-3;
            top = text_offset_top-1;
        }
        // console.log("--------------->", color, i, title.length, "fontsize: ", size, "y:",y,"top:", top);
        pdf.setFontSize(size);
        pdf.text(title, x+left, y+top);

        // descripcion
        pdf.setFontSize(10);
        pdf.text(this.local.string[card.desc], x+left, y+top+head-1, {maxWidth: w-left-left}); 

    }
    // print PDF (end) ------------------------------------------------


    goHome() {
        this.router.navigate(['/home'], );
    }

    agregar(card:Card) {
        // console.log("CanvasPage.agregar", card);
        this.deck.addToCanvas(card);
        this.slots.update();
        this.deck.updatePitch();
        this.updateCounter();
    }

    descartar(card:Card) {
        if (this.lockcanvas) {
            return;
        }
        // console.log("CanvasPage.descartar", card);
        this.deck.removeFromCanvas(card);
        this.slots.update();
        this.deck.updatePitch();
        this.updateCounter();
    }

    onIndustriaChange() {
        this.deck.updatePitch();
    }

    slots: PivotFourSlotsComponent;
    onSlotsReady(slots: PivotFourSlotsComponent) {
        this.slots = slots;
    }   
    
    counter: PivotCounterComponent;
    clearCount() {
        if (this.counter) this.counter.clearCount();
    }

    updateCounter() {
        if (this.counter) this.counter.updateCounter();
    }

    onCounterInit(c: PivotCounterComponent) {
        this.counter = c;
    }

    input: PivotIndustriaInputComponent;
    onIndustriaInit(input: PivotIndustriaInputComponent) {
        this.input = input;
        // this.input.showErrors();
    }



    // -----------------------------------------------
    //*/
    async aux() {}
    /*/
    async aux() {
        console.error("---------- TEMPORAL ----------");
        await this.deck.waitLoaded;
        let selection = [2,5,10, 28,31,30, 38,44, 53,69];
        let canvas =    [2,5,   28,31,       44,    53,69];
        this.deck.resetSelection();
        for (let i=0; i<this.deck.deck.length; i++) {
            var card:Card = this.deck.deck[i];
            if (selection.indexOf(parseInt(card.card)) != -1) {
                this.deck.selectCard(card);
            }
        }
        this.deck.resetCanvas();
        for (let i=0; i<this.deck.deck.length; i++) {
            var card:Card = this.deck.deck[i];
            if (canvas.indexOf(parseInt(card.card)) != -1) {
                this.deck.addToCanvas(card);
            }
        }
        this.deck.industria = "veterinaria";
        this.deck.updatePitch();
    }
    //*/
    
}
/*

    
*/ 