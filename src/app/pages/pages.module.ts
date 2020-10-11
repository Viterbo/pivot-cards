import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CanvasPage } from './canvas/canvas.page';
import { FilterPage } from './filter/filter.page';
import { HomePage } from './home/home.page';
import { SelectionPage } from './selection/selection.page';
import { SlotsPage } from './slots/slots.page';
import { WelcomePage } from './welcome/welcome.page';
import { PivotComponentsModule } from '../components/components.module';
import { CommonServicesModule } from '../services/common/common.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CartasPage } from './cartas/cartas.page';


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



@NgModule({
    imports: [
        RouterModule,
        FormsModule,
        IonicModule,
        CommonModule,
        CommonServicesModule,
        PivotComponentsModule,
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
        CanvasPage,
        FilterPage,
        HomePage,
        SelectionPage,
        SlotsPage,
        WelcomePage,
        CartasPage
    ],
    entryComponents: [
    ],
    providers: [
        
    ],
    exports: [
        CanvasPage,
        FilterPage,
        HomePage,
        SelectionPage,
        SlotsPage,
        WelcomePage,
        CartasPage
    ]
})
export class PagesModule {}
