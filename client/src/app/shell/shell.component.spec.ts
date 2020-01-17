import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellComponent } from './shell.component';
import { HeaderComponent } from '@shell/components/header/header.component';
import { FooterComponent } from '@shell/components/footer/footer.component';
import { ShellService } from '@shell/service/shell.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '@app/shared';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        SharedModule,
        RouterTestingModule
      ],
      declarations: [
        ShellComponent,
        HeaderComponent,
        FooterComponent
      ],
      providers: [
        ShellService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
