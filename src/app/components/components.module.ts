import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PivotCardComponent } from './pivot-card/pivot-card.component';
import { PivotDeckComponent } from './pivot-deck/pivot-deck.component';
import { VpeComponentsService, VpeAbstractComponent } from './vpe-components.service';
import { VpeResizeDetector } from './vpe-resize-detector.directive';
import { FormsModule } from '@angular/forms';
import { CardSlotComponent } from './card-slot/card-slot.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule
    ],
    declarations: [
        PivotCardComponent,
        PivotDeckComponent,
        CardSlotComponent,
        VpeResizeDetector
    ],
    entryComponents: [
    ],
    providers: [
        VpeComponentsService,
    ],
    exports: [
        CardSlotComponent,
        PivotCardComponent,
        PivotDeckComponent
    ]
})
export class PivotComponentsModule {}
