import { Component, HostBinding, AfterViewInit, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DeckService, Card } from 'src/app/services/deck.service';
import { PivotFourSlotsComponent } from 'src/app/components/pivot-four-slots/pivot-four-slots.component';
import { AppService } from 'src/app/services/common/app.service';

import { jsPDF, jsPDFOptions } from "jspdf";
import { LoadingController } from '@ionic/angular';



@Component({
    selector: 'canvas-page',
    templateUrl: 'canvas.page.html',
    styleUrls: ['canvas.page.scss'],
})
export class CanvasPage implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

    page: string = "canvas";
    // slots: {[name:string]:CardSlotComponent};
    
    initialized: boolean;
    lockcanvas: boolean;
    useCanvasExtended: boolean;
    useCardsExtended: boolean;

    top = 10;
    left = 5;
    cellw = 90;
    cellh = 70;
    canvasl = 10;
    canvast = 60;

    // selected: {[key:string]:number};
    
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public deck: DeckService,
        public app: AppService,
        public loadingController: LoadingController
    ) {
        this.lockcanvas = false;
        this.useCanvasExtended = true;
        this.useCardsExtended = true;
        this.initialized = false;
    }

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

    get showPrintBtn() {
        return this.deck.isCanvasOK();
    }

    private init() {
        if (this.initialized) return;
        this.initialized = true;
        console.debug("CanvasPage.init()");
        this.route.queryParams.subscribe(params => {
            console.debug("CanvasPage.init() params:", params);
            if (params && params.lockcanvas) {
                this.lockcanvas = true;
            } else {
                this.deck.updatePitch();
                this.deck.resetCanvas();

                // this.aux();

                this.deck.sortDeck(this.deck.subset);
            }
        });
    }

    ngAfterViewChecked() {this.init();}

    ngAfterViewInit() {}
    ngOnInit() {}
    ngOnDestroy() {}

    auxGetImage(canvas: HTMLCanvasElement, color: string) {
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        var img = new Image();
        img.id = "pic";
        img.src = canvas.toDataURL();
        return img;
    }

    
    
    async print() {

        const loading = await this.loadingController.create({
            cssClass: 'pivot-alert-class',
            message: 'Generando PDF...'
        });
        await loading.present();


        // alert("Imprimir hoja A4 con canvas y pitch");
        console.log("this.deck", this.deck);
        const element = document.getElementById('canvas');

        const pivotAzul:HTMLImageElement = <HTMLImageElement>document.getElementById('pivot-azul');
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

        // auxiliar --------------------------------------
        // creamos una imagen de 10x10 de fondo rojo -------------
        /* 
        var red = this.auxGetImage(canvas, "red");
        var green = this.auxGetImage(canvas, "green");
        var blue = this.auxGetImage(canvas, "blue");
        var grey = this.auxGetImage(canvas, "grey");
        var black = this.auxGetImage(canvas, "black");
        var white = this.auxGetImage(canvas, "white");
        // width:  210;
        // height: 297;
        // 

        
        pdf.addImage(grey,    'PNG',    0,   0, 210, 297); // tapo la hoja de grey
        pdf.addImage(white,   'PNG', this.left, this.top, 200, 280); // pinto de blanco sólo la zona usable

        // horizontal
        pdf.addImage(black,     'PNG', this.left+  0, this.top-1, 20, 1);
        pdf.addImage(black,     'PNG', this.left+ 40, this.top-1, 20, 1);
        pdf.addImage(black,     'PNG', this.left+ 80, this.top-1, 20, 1);
        pdf.addImage(black,     'PNG', this.left+120, this.top-1, 20, 1);
        pdf.addImage(black,     'PNG', this.left+160, this.top-1, 20, 1);

        // vertical
        pdf.addImage(black,     'PNG', this.left-1, this.top+ 20, 1, 20);
        pdf.addImage(black,     'PNG', this.left-1, this.top+ 60, 1, 20);
        pdf.addImage(black,     'PNG', this.left-1, this.top+100, 1, 20);
        pdf.addImage(black,     'PNG', this.left-1, this.top+140, 1, 20);
        pdf.addImage(black,     'PNG', this.left-1, this.top+180, 1, 20);
        pdf.addImage(black,     'PNG', this.left-1, this.top+220, 1, 20);
        pdf.addImage(black,     'PNG', this.left-1, this.top+260, 1, 20);
        //*/
        // -----------------------------------------------



        // title image
        pdf.addImage(pivotAzul, 'PNG', this.left+10, this.top+5, 40, 16.34);

        // pdf.setFillColor(56, 128, 255); // blue
        // pdf.setFillColor(235, 68, 90); // red
        // pdf.setFillColor(45, 211, 111); // green
        // pdf.setFillColor(255, 196, 9); // yellow
        let top = 20;
        let margin = 0;
        let titlesize = 20;

        // paint canvas ------------
        pdf.setFontSize(titlesize);
        pdf.text(
            "Canvas:",
            this.left+this.canvasl+margin,
            this.top+this.canvast-top*0.5
        );        
        pdf.setFillColor(251, 217, 222); // light-red
        pdf.rect(this.left+this.canvasl, this.top+this.canvast, this.cellw, this.cellh, 'F');
        pdf.setFillColor(215, 230, 255); // light-blue
        pdf.rect(this.left+this.canvasl+this.cellw, this.top+this.canvast, this.cellw, this.cellh, 'F');
        pdf.setFillColor(213, 246, 226); // light-green
        pdf.rect(this.left+this.canvasl, this.top+this.canvast+this.cellh, this.cellw, this.cellh, 'F');
        pdf.setFillColor(255, 243, 205); // light-yellow
        pdf.rect(this.left+this.canvasl+this.cellw, this.top+this.canvast+this.cellh, this.cellw, this.cellh, 'F');

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
            this.top+this.canvast+this.cellh*2+top
        );
        //*/        
        pdf.setFontSize(12);
        pdf.text(
            this.deck.pitch.text,
            this.left+this.canvasl+margin,
            this.top+this.canvast+this.cellh*2+top+10,
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

        loading.dismiss();
        pdf.save("canvas.pdf");
    }

    
    printCard(pdf:jsPDF, card:Card, color:string, i:number) {


        let x=this.left+this.canvasl,y=this.top+this.canvast;
        let w=70, h=40, r=1;
        let top = 13, left = 9;
        let head = 10;

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
            y += Math.round(top * (i+0.6));
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
        let title = card.card + " - " + card.name;
        let size = 15;
        top = 7;
        left = 3;
        
        if (title.length > 25) {
            size = 14;
            top = 7;
        }
        if (title.length > 28) {
            size = 13;
            top = 7;
        }
        if (title.length > 31) {
            size = 12;
            top = 6;
        }
        // console.log("--------------->", color, i, title.length, "fontsize: ", size, "top:", top);
        pdf.setFontSize(size);
        pdf.text(title, x+left, y+top);

        // descripcion
        pdf.setFontSize(10);
        pdf.text(card.desc, x+left, y+top+head-1, {maxWidth: w-left-left}); 

    }


    goHome() {
        this.initialized = false;
        this.router.navigate(['/home'], );
    }

    agregar(card:Card) {
        // console.log("CanvasPage.agregar", card);
        this.deck.addToCanvas(card);
        this.slots.update();
        this.deck.updatePitch();
    }

    descartar(card:Card) {
        if (this.lockcanvas) {
            return;
        }
        // console.log("CanvasPage.descartar", card);
        this.deck.removeFromCanvas(card);
        this.slots.update();
        this.deck.updatePitch();
    }
    
    

    onIndustriaChange() {
        this.deck.updatePitch();
    }

    slots: PivotFourSlotsComponent;
    onSlotsReady(slots: PivotFourSlotsComponent) {
        this.slots = slots;
    }    
    
}
