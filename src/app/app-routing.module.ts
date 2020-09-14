import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { WelcomePage } from './pages/welcome/welcome.page';
import { SelectionPage } from './pages/selection/selection.page';
import { FilterPage } from './pages/filter/filter.page';
import { SlotsPage } from './pages/slots/slots.page';
import { CanvasPage } from './pages/canvas/canvas.page';
import { PrintPage } from './pages/print/print.page';
import { CartasPage } from './pages/cartas/cartas.page';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomePage
    },
    {
        path: 'welcome',
        component: WelcomePage
    },
    {
        path: 'selection',
        component: SelectionPage
    },
    {
        path: 'cartas',
        component: CartasPage
    },  
    {
        path: 'filter',
        component: FilterPage
    },
    {
        path: 'slots',
        component: SlotsPage
    },
    {
        path: 'canvas',
        component: CanvasPage
    },
    {
        path: 'print',
        component: PrintPage
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
