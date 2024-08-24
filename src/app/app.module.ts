import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AuthComponent} from './theme/auth/auth.component';
import {HeaderComponent} from './theme/shared/header/header.component';
import {NavbarLeftComponent} from './theme/shared/navbar-left/navbar-left.component';
import {BoardComponent} from './theme/main-board/board.component';
import {FooterComponent} from './theme/shared/footer/footer.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutes} from './app-routes';
import {HttpClientModule} from '@angular/common/http';
import {SidebarModule} from 'primeng/sidebar';
import {ButtonModule} from 'primeng/button';
import {AppComponent} from './app.component';
import {AuthGuard} from './shared/guards/auth.guard';
import {LOCALE_ID} from '@angular/core';
import {ComponentsModule} from "./main/components/components.module";
import {DndDirective} from "./core/directives/dnd.directive";
import { SubirArchivosComponent } from './main/components/subir-archivos/subir-archivos.component';
import {ComentarioAuditoriaComponent} from "./main/components/comentario-auditoria/comentario-auditoria.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        HeaderComponent,
        NavbarLeftComponent,
        BoardComponent,
        FooterComponent,
        DndDirective,
        SubirArchivosComponent,
        ComentarioAuditoriaComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutes,
        HttpClientModule,
        SidebarModule,
        ButtonModule,
        ReactiveFormsModule,
        ComponentsModule,
        NgbModule
    ],
    providers: [
        AuthGuard,
        {provide: LOCALE_ID, useValue: 'es-PE'},
        // {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
        // {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA],
    exports: [
        DndDirective
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
