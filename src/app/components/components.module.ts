import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PivotCardComponent } from './pivot-card/pivot-card.component';
import { PivotDeckComponent } from './pivot-deck/pivot-deck.component';
import { VpeComponentsService, VpeAbstractComponent } from './vpe-components.service';
import { VpeResizeDetector } from './vpe-resize-detector.directive';
import { FormsModule } from '@angular/forms';
import { CardSlotComponent } from './card-slot/card-slot.component';
import { IonicModule } from '@ionic/angular';
import { PivotBackBtnComponent } from './pivot-back-btn/pivot-back-btn.component';
import { RouterModule } from '@angular/router';
import { PivotIndustriaInputComponent } from './pivot-industria-input/pivot-industria-input.component';

// Angular-Material ----------------------------------
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule} from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
// https://stackoverflow.com/a/53406105/2274525
import { ReactiveFormsModule } from '@angular/forms';
// Angular-Material ----------------------------------

import { PivotFourSlotsComponent } from './pivot-four-slots/pivot-four-slots.component';
import { ColorCardListComponent } from './color-card-list/color-card-list.component';
import { PivotPitchComponent } from './pivot-pitch/pivot-pitch.component';
import { PivotCanvasComponent } from './pivot-canvas/pivot-canvas.component';


@NgModule({
    imports: [
        RouterModule,
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // Angular-Material ----------------------------------
        MatCardModule, 
        MatButtonModule, 
        MatMenuModule, 
        MatToolbarModule, 
        MatIconModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,
        MatBadgeModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatSelectModule,
        // 
        ReactiveFormsModule
        // Angular-Material ----------------------------------
    ],
    declarations: [
        PivotCardComponent,
        PivotDeckComponent,
        CardSlotComponent,
        VpeResizeDetector,
        PivotBackBtnComponent,
        PivotIndustriaInputComponent,
        PivotFourSlotsComponent,
        ColorCardListComponent,
        PivotPitchComponent,
        PivotCanvasComponent
    ],
    entryComponents: [
    ],
    providers: [
        VpeComponentsService,
    ],
    exports: [
        CardSlotComponent,
        PivotCardComponent,
        PivotDeckComponent,
        PivotBackBtnComponent,
        PivotIndustriaInputComponent,
        PivotFourSlotsComponent,
        ColorCardListComponent,
        PivotPitchComponent,
        PivotCanvasComponent
        
    ]
})
export class PivotComponentsModule {}
