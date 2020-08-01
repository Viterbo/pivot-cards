import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PivotCardComponent } from './pivot-card/pivot-card.component';
import { PivotDeckComponent } from './pivot-deck/pivot-deck.component';
import { VpeComponentsService, VpeAbstractComponent } from './vpe-components.service';
import { VpeResizeDetector } from './vpe-resize-detector.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        PivotCardComponent,
        PivotDeckComponent,
        VpeResizeDetector
    ],
    entryComponents: [
    ],
    providers: [
        VpeComponentsService,
    ],
    exports: [
        
        PivotCardComponent,
        PivotDeckComponent
    ]
})
export class PivotComponentsModule {}
