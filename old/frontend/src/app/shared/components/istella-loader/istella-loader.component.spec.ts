import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IstellaLoaderComponent } from './istella-loader.component';

describe('IstellaLoaderComponent', () => {
  let component: IstellaLoaderComponent;
  let fixture: ComponentFixture<IstellaLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IstellaLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IstellaLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
