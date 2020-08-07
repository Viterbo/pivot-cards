import { ElementRef, OnChanges, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { Directive } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { Subscriber } from 'rxjs';
import { VpeComponentsService, VpeAbstractComponent } from './vpe-components.service';

export interface Device {
    fullhd?:boolean, // >= 1600px
    full?:boolean,   // >= 1200px
    big?:boolean,    // < 1200px
    normal?:boolean, // < 992px
    medium?:boolean, // < 768px
    small?:boolean,  // < 576px
    tiny?:boolean,   // < 420px
    portrait?:boolean,
    wide?:boolean,
    height?:number,
    width?: number,
    class?: string
}

export interface ResizeEvent {
    device:Device,
    id?:string,
    width:number,
    height:number,
    el: ElementRef
}

export interface ResizeHandler {
    onResize(ResizeEvent):void;
}

@Directive({
    selector:"[vpeResizeDetector]"
})
export class VpeResizeDetector implements OnChanges, OnDestroy, AfterViewInit {

    resizeEvent:ResizeEvent;
    private onResizeSubscriber: Subscriber<any>;
    private handler: ResizeHandler;

    constructor(
        private element: ElementRef,
        private components: VpeComponentsService,
        private _handler: VpeAbstractComponent
    ) {
        this.handler = <ResizeHandler>this._handler;
        this.onResizeSubscriber = new Subscriber<string>(this.triggerResize.bind(this));
    }

    triggerResize(device:Device) {        
        // console.log("VpeResizeDetector.triggerResize()");
        this.resizeEvent = {
            device: device,
            width: this.element.nativeElement.offsetWidth,
            height: this.element.nativeElement.offsetHeight,
            // id: this.id,
            el: this.element
        };
        this.handler.onResize(this.resizeEvent);
    }

    ngOnChanges() {
        this.triggerResize(this.components.device);
    }

    ngOnDestroy() {
        this.onResizeSubscriber.unsubscribe();
    }
    
    ngAfterViewInit() {
        // console.log("VpeResizeDetector.ngAfterViewInit()");
        this.components.onResize.subscribe(this.onResizeSubscriber);
        this.triggerResize(this.components.device);
    }    
}

