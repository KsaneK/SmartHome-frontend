import { NgModule } from '@angular/core';
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
  MatSnackBarModule, MatExpansionModule, MatStepperModule, MatSelectModule, MatTableModule,
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
    MatSnackBarModule,
    MatExpansionModule,
    MatStepperModule,
    MatSelectModule,
    MatTableModule,
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
    MatSnackBarModule,
    MatExpansionModule,
    MatStepperModule,
    MatSelectModule,
    MatTableModule,
  ],
})
export class MaterialModule {
}
