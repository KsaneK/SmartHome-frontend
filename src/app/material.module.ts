import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatNativeDateModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatToolbarModule,
  MatMenuModule,
  MatTabsModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatSnackBarModule,
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatNativeDateModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule
  ],
  exports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatNativeDateModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule
  ],
})
export class MaterialModule {
}
